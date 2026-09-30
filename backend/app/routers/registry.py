from typing import List
from sqlmodel import Session, or_, select
from fastapi import APIRouter, Depends, HTTPException, status, Query


from app.database import get_session
from app.models import Agency
from app.schemas import AgencyCreate, AgencyRead

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