import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from app.config import UPLOAD_DIR

from app.database import get_session
from app.models import Contract, WageLog, GuardianContact, Worker
from app.schemas import (
    ContractCreate,
    WageLogCreate,
    WageSummary,
    GuardianContactCreate,
)
from app.dependencies import get_current_worker

router = APIRouter()

@router.post("/me/contracts")
def create_contract(
    payload: ContractCreate,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    flags = []
    if payload.wage <= 0:
        flags.append("missing_wage")
    
    terms_lower = payload.terms.lower()
    if "rest day" not in terms_lower:
        flags.append("missing_rest_day_clause")
    if "terminat" not in terms_lower:
        flags.append("missing_termination_clause")
        
    terms_dict = {"terms": payload.terms}
    if payload.hours:
        terms_dict["hours"] = payload.hours
        
    contract = Contract(
        worker_id=worker.id,
        agency_id=payload.agency_id,
        wage=payload.wage,
        terms_json=json.dumps(terms_dict),
        start_date=payload.start_date,
        end_date=payload.end_date
    )
    
    session.add(contract)
    session.commit()
    session.refresh(contract)
    
    return {"contract": contract.model_dump(), "flags": flags}

@router.get("/me/contracts")
def get_contracts(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contracts = session.exec(select(Contract).where(Contract.worker_id == worker.id)).all()
    return contracts

@router.post("/me/contracts/{id}/wage-log")
def create_wage_log(
    id: str,
    payload: WageLogCreate,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contract = session.exec(select(Contract).where(Contract.id == id)).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.worker_id != worker.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this contract")
        
    wage_log = WageLog(
        contract_id=contract.id,
        amount=payload.amount,
        paid_on=payload.paid_on,
        note=payload.note
    )
    session.add(wage_log)
    session.commit()
    session.refresh(wage_log)
    
    return wage_log

@router.get("/me/contracts/{id}/wage-summary", response_model=WageSummary)
def get_wage_summary(
    id: str,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contract = session.exec(select(Contract).where(Contract.id == id)).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.worker_id != worker.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this contract")
        
    # DB columns are timezone-naive (stored as UTC); normalise so aware/naive never mix.
    def as_utc(dt: datetime) -> datetime:
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)

    now = datetime.now(timezone.utc)
    end_date_for_math = as_utc(contract.end_date) if contract.end_date else now
    if end_date_for_math > now:
        end_date_for_math = now

    diff_days = (end_date_for_math - as_utc(contract.start_date)).days
    months_elapsed = diff_days / 30.0
    if months_elapsed < 0:
        months_elapsed = 0
        
    total_owed = months_elapsed * contract.wage
    
    wage_logs = session.exec(select(WageLog).where(WageLog.contract_id == contract.id)).all()
    total_paid = sum(log.amount for log in wage_logs)
    
    return WageSummary(
        total_owed=round(total_owed, 2),
        total_paid=round(total_paid, 2),
        balance=round(total_owed - total_paid, 2)
    )

@router.post("/me/guardian-contacts")
def add_guardian_contact(
    payload: GuardianContactCreate,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    existing_contacts = session.exec(
        select(GuardianContact).where(GuardianContact.worker_id == worker.id)
    ).all()
    
    if len(existing_contacts) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 guardian contacts allowed")
        
    contact = GuardianContact(
        worker_id=worker.id,
        name=payload.name,
        relation=payload.relation,
        channel=payload.channel,
        phone=payload.phone
    )
    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact

@router.get("/me/guardian-contacts")
def get_guardian_contacts(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contacts = session.exec(
        select(GuardianContact).where(GuardianContact.worker_id == worker.id)
    ).all()
    return contacts

@router.get("/me/record/export")
def export_record(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    contracts = session.exec(select(Contract).where(Contract.worker_id == worker.id)).all()
    contacts = session.exec(select(GuardianContact).where(GuardianContact.worker_id == worker.id)).all()
    
    # PDF rendering is a follow-up, not built here
    return {
        "worker": worker.model_dump(),
        "contracts": [c.model_dump() for c in contracts],
        "guardian_contacts": [c.model_dump() for c in contacts]
    }


# ---- Contract documents (photos / PDFs of the signed contract) --------------

ALLOWED_DOC_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "application/pdf": ".pdf",
}
MAX_DOC_BYTES = 10 * 1024 * 1024  # 10 MB per file
MAX_DOCS_PER_CONTRACT = 20


def _owned_contract(session: Session, contract_id: str, worker: Worker) -> Contract:
    contract = session.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.worker_id != worker.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this contract")
    return contract


def _documents(contract: Contract) -> list:
    """document_ref holds a JSON list of {id, name, content_type, size, uploaded_at}."""
    if not contract.document_ref:
        return []
    try:
        docs = json.loads(contract.document_ref)
        return docs if isinstance(docs, list) else []
    except ValueError:
        return []


def _doc_dir(contract: Contract) -> Path:
    return Path(UPLOAD_DIR) / contract.worker_id / contract.id


@router.post("/me/contracts/{id}/documents")
async def upload_contract_documents(
    id: str,
    files: List[UploadFile] = File(...),
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session),
):
    contract = _owned_contract(session, id, worker)
    docs = _documents(contract)
    if len(docs) + len(files) > MAX_DOCS_PER_CONTRACT:
        raise HTTPException(status_code=400, detail=f"A contract can have at most {MAX_DOCS_PER_CONTRACT} pages")

    # Validate everything before writing anything
    payloads = []
    for f in files:
        ext = ALLOWED_DOC_TYPES.get(f.content_type or "")
        if not ext:
            raise HTTPException(status_code=415, detail=f"'{f.filename}' is not a photo or PDF")
        data = await f.read()
        if len(data) == 0:
            raise HTTPException(status_code=400, detail=f"'{f.filename}' is empty")
        if len(data) > MAX_DOC_BYTES:
            raise HTTPException(status_code=413, detail=f"'{f.filename}' is larger than 10 MB")
        payloads.append((f, ext, data))

    folder = _doc_dir(contract)
    folder.mkdir(parents=True, exist_ok=True)
    added = []
    for f, ext, data in payloads:
        doc_id = uuid.uuid4().hex
        (folder / f"{doc_id}{ext}").write_bytes(data)
        added.append({
            "id": doc_id,
            "name": Path(f.filename or f"page{ext}").name,
            "content_type": f.content_type,
            "size": len(data),
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
        })

    contract.document_ref = json.dumps(docs + added)
    session.add(contract)
    session.commit()
    return {"documents": docs + added}


@router.get("/me/contracts/{id}/documents")
def list_contract_documents(
    id: str,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session),
):
    contract = _owned_contract(session, id, worker)
    return {"documents": _documents(contract)}


@router.get("/me/contracts/{id}/documents/{doc_id}")
def get_contract_document(
    id: str,
    doc_id: str,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session),
):
    contract = _owned_contract(session, id, worker)
    doc = next((d for d in _documents(contract) if d.get("id") == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    path = _doc_dir(contract) / f"{doc_id}{ALLOWED_DOC_TYPES.get(doc['content_type'], '')}"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Document file is missing")
    return FileResponse(path, media_type=doc["content_type"], filename=doc["name"])
