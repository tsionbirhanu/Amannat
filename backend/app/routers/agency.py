from typing import List
from sqlmodel import Session, or_, select, func
from fastapi import APIRouter, Depends, HTTPException, status, Query


from app.database import get_session
from app.dependencies import get_current_worker
from app.models import Agency, Report, Shortlist, Worker
from app.schemas import AgencyCreate, AgencyRead, ShortlistCreate

router = APIRouter()

@router.post(
    "/agencies",
    response_model=AgencyRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create an agency/employer (Testing & Seeding)"
)
def create_agency(
    payload: AgencyCreate,
    session: Session = Depends(get_session)
):
    name_clean = payload.name.strip()
    if not name_clean:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Agency name cannot be blank."
        )

    # Check for duplicate license_no if provided
    if payload.license_no:
        existing = session.exec(
            select(Agency).where(Agency.license_no == payload.license_no.strip())
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Agency with license number '{payload.license_no}' already exists."
            )

    agency = Agency(
        name=name_clean,
        license_no=payload.license_no.strip() if payload.license_no else None,
        phone=payload.phone.strip() if payload.phone else None,
        email=payload.email.strip() if payload.email else None,
        location=payload.location.strip() if payload.location else None,
        verification_status=payload.verification_status or "unverified"
    )

    session.add(agency)
    session.commit()
    session.refresh(agency)

    return agency

@router.get(
    "/search",
    response_model=List[Agency],
    summary="Search agencies by name, license number, location or phone"
)
def search_agencies(
    q: str = Query(..., min_length=1, description="Search term for name, license number, or phone"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
):
    search_term = q.strip()
    if not search_term:
        return []

    pattern = f"%{search_term}%"

    statement = (
        select(Agency)
        .where(
            or_(
                Agency.name.ilike(pattern),
                Agency.license_no.ilike(pattern),
                Agency.phone.ilike(pattern),
                Agency.location.ilike(pattern),
            )
        )
        .offset(offset)
        .limit(limit)
    )

    return session.exec(statement).all()

@router.get(
    "/agencies/{id}",
    summary="Get agency details with aggregated report flags"
)
def get_agency_details(
    id: str,
    session: Session = Depends(get_session)
):
    # 1. Fetch agency
    agency = session.exec(select(Agency).where(Agency.id == id)).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # 2. Compute aggregated report counts per category (FR-2.4 Privacy)
    report_counts = session.exec(
        select(Report.category, func.count(Report.id))
        .where(Report.agency_id == id)
        .group_by(Report.category)
    ).all()

    report_flags = [
        {"category": cat, "count": count}
        for cat, count in report_counts
    ]

    # 3. Return agency details with aggregated flags
    agency_data = agency.model_dump()
    agency_data["report_flags"] = report_flags
    return agency_data

@router.post(
    "/shortlist",
    status_code=status.HTTP_201_CREATED,
    summary="Add an agency to the authenticated worker's shortlist"
)
def add_to_shortlist(
    payload: ShortlistCreate,
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    # 1. Verify target agency exists
    agency = session.exec(select(Agency).where(Agency.id == payload.agency_id)).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # 2. Check if already shortlisted by this worker
    existing = session.exec(
        select(Shortlist)
        .where(Shortlist.worker_id == worker.id)
        .where(Shortlist.agency_id == payload.agency_id)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Agency is already in your shortlist."
        )

    # 3. Create shortlist record
    shortlist_item = Shortlist(
        worker_id=worker.id,
        agency_id=agency.id
    )
    session.add(shortlist_item)
    session.commit()
    session.refresh(shortlist_item)

    return {
        "message": "Agency added to shortlist successfully.",
        "shortlist_id": shortlist_item.id,
        "agency_id": shortlist_item.agency_id
    }


@router.get(
    "/shortlist",
    response_model=List[Agency],
    summary="Get all agencies in the authenticated worker's shortlist"
)
def get_worker_shortlist(
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    # Query agencies joined with the shortlist entries belonging exclusively to this worker
    statement = (
        select(Agency)
        .join(Shortlist, Shortlist.agency_id == Agency.id)
        .where(Shortlist.worker_id == worker.id)
    )
    agencies = session.exec(statement).all()
    return agencies