import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models import OtpCode, Worker
from app.schemas import OtpRequest, OtpVerify, Token
from app.integrations.sms_gateway import send_otp_sms
from app.security import create_access_token
from app.dependencies import get_current_worker

router = APIRouter()

@router.post("/otp/request")
def request_otp(payload: OtpRequest, session: Session = Depends(get_session)):
    # Generate 6-digit code
    code = f"{random.randint(0, 999999):06d}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    otp = OtpCode(phone=payload.phone, code=code, expires_at=expires_at)
    session.add(otp)
    session.commit()
    
    send_otp_sms(payload.phone, code)
    return {"message": "OTP sent"}

@router.post("/otp/verify", response_model=Token)
def verify_otp(payload: OtpVerify, session: Session = Depends(get_session)):
    # Find most recent valid OTP
    now = datetime.now(timezone.utc)
    statement = (
        select(OtpCode)
        .where(OtpCode.phone == payload.phone)
        .where(OtpCode.code == payload.code)
        .where(OtpCode.expires_at > now)
        .order_by(OtpCode.expires_at.desc())
    )
    otp = session.exec(statement).first()
    
    if not otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code"
        )
    
    # Find or create worker
    worker = session.exec(select(Worker).where(Worker.phone == payload.phone)).first()
    if not worker:
        worker = Worker(phone=payload.phone)
        session.add(worker)
        session.commit()
        session.refresh(worker)
        
    # Delete the used OTP
    session.delete(otp)
    session.commit()
    
    # Generate token
    token = create_access_token(worker_id=worker.id, phone=worker.phone)
    return Token(access_token=token, token_type="bearer")

@router.get("/me")
def get_me(worker: Worker = Depends(get_current_worker)):
    return worker
