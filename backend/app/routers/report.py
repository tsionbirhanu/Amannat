import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_worker
from app.models import Agency, Contract, Report, Worker, Appeal
from app.schemas import AppealCreate, ReportCreate

router = APIRouter()

# ... keep existing POST /agencies, GET /search, GET /agencies/{id} ...

@router.post(
    "/reports",
    status_code=status.HTTP_201_CREATED,
    summary="Submit a report against an agency (Authenticated Worker)"
)
def create_report(
    payload: ReportCreate,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    # 1. Verify agency exists
    agency = session.exec(
        select(Agency).where(Agency.id == payload.agency_id)
    ).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # 2. FR-2.3: Check if worker has an existing contract/placement with this agency
    contract = session.exec(
        select(Contract)
        .where(Contract.worker_id == worker.id)
        .where(Contract.agency_id == payload.agency_id)
    ).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot submit report: No placement/contract record found with this agency."
        )

    # 3. FR-2.4: Generate pseudonymized ID for public aggregation
    pseudo_id = hashlib.sha256(f"worker_{worker.id}".encode()).hexdigest()[:16]

    # 4. Create and persist report
    report = Report(
        agency_id=payload.agency_id,
        category=payload.category,
        description=payload.description.strip() if payload.description else None,
        worker_pseudo_id=pseudo_id,
        worker_id_raw=worker.id,  # council review only
        verified_status="pending"
    )
    session.add(report)
    session.commit()
    session.refresh(report)

    # Return safe confirmation without leaking worker identity or raw text
    return {
        "message": "Report submitted successfully and queued for review.",
        "report_id": report.id,
        "agency_id": report.agency_id,
        "category": report.category,
        "verified_status": report.verified_status
    }

@router.post(
    "/agencies/{id}/appeal",
    response_model=Appeal,
    status_code=status.HTTP_201_CREATED,
    summary="Submit an agency right-of-reply appeal"
)
def create_agency_appeal(
    id: str,
    payload: AppealCreate,
    session: Session = Depends(get_session)
):
    # 1. Verify agency exists
    agency = session.exec(select(Agency).where(Agency.id == id)).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # 2. Check if there are any reports to appeal against
    existing_report = session.exec(
        select(Report).where(Report.agency_id == id)
    ).first()
    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit appeal: No reports recorded against this agency to appeal."
        )

    # 3. Validate message content
    message_clean = payload.message.strip()
    if not message_clean:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Appeal message cannot be blank."
        )

    # 4. Create appeal
    appeal = Appeal(
        agency_id=agency.id,
        message=message_clean,
        status="pending"
    )
    session.add(appeal)
    session.commit()
    session.refresh(appeal)

    return appeal