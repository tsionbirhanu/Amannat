from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_worker
from app.models import CouncilDecision, Worker
from app.schemas import CouncilDecisionCreate, CouncilDecisionPublic

router = APIRouter()


@router.post(
    "/decisions",
    response_model=CouncilDecision,
    status_code=status.HTTP_201_CREATED,
    summary="Record a council decision (FR-5.2)"
)
def create_decision(
    payload: CouncilDecisionCreate,
    # TODO: restrict to council role once a role/permission system exists
    worker: Worker = Depends(get_current_worker),
    session: Session = Depends(get_session)
):
    decision = CouncilDecision(
        case_id=payload.case_id,
        ruling=payload.ruling,
        published_summary=payload.published_summary
    )
    session.add(decision)
    session.commit()
    session.refresh(decision)
    return decision


@router.get(
    "/decisions",
    response_model=List[CouncilDecisionPublic],
    summary="List published council decisions (FR-5.3, public)"
)
def list_decisions(session: Session = Depends(get_session)):
    # Public endpoint: the full ruling stays internal, only the published summary is exposed
    statement = select(CouncilDecision).order_by(CouncilDecision.created_at.desc())
    return session.exec(statement).all()
