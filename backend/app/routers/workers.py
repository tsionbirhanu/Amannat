import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

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
        
    end_date_for_math = contract.end_date if contract.end_date else datetime.now(timezone.utc)
    now = datetime.now(timezone.utc)
    if end_date_for_math > now:
        end_date_for_math = now
        
    diff_days = (end_date_for_math - contract.start_date).days
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
