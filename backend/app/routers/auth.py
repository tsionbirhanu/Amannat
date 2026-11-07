import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models import OtpCode, Worker
from app.schemas import OtpRequest, OtpVerify, Token
from app import config
from app.integrations.sms_gateway import send_otp_sms, OtpDeliveryError
from app.phone import normalize_phone
from app.security import create_access_token
from app.dependencies import get_current_worker

router = APIRouter()

@router.post("/otp/request")
def request_otp(payload: OtpRequest, session: Session = Depends(get_session)):
    phone = _normalized(payload.phone)
    now = datetime.now(timezone.utc)
    ttl = timedelta(minutes=config.OTP_TTL_MINUTES)

    # Rate limits. A code's creation time is expires_at - TTL, so "created in the
    # last N" is "expires_at > now + TTL - N". Codes are cleared on a successful
    # login, so this counts unused requests, which is what abuse looks like.
    def requested_since(window: timedelta) -> int:
        return len(session.exec(
            select(OtpCode.id).where(OtpCode.phone == phone).where(OtpCode.expires_at > now + ttl - window)
        ).all())

    if requested_since(timedelta(minutes=1)) >= config.OTP_REQUESTS_PER_MINUTE:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Please wait a minute before asking for another code.")
    if requested_since(timedelta(hours=1)) >= config.OTP_REQUESTS_PER_HOUR:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many codes requested for this number. Please try again in an hour.")

    # Cryptographically secure 6-digit code
    code = f"{secrets.randbelow(1_000_000):06d}"
    otp = OtpCode(phone=phone, code=code, expires_at=now + ttl)
    session.add(otp)
    session.commit()

    try:
        channel = send_otp_sms(phone, code)
    except OtpDeliveryError as exc:
        # Not delivered: drop the code so it neither works nor counts against the limits
        session.delete(otp)
        session.commit()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT if exc.code == "telegram_not_linked" else status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": exc.code, "message": exc.message, "bot_url": exc.bot_url},
        )
    return {"message": "OTP sent", "channel": channel}


@router.post("/otp/verify", response_model=Token)
def verify_otp(payload: OtpVerify, session: Session = Depends(get_session)):
    phone = _normalized(payload.phone)
    now = datetime.now(timezone.utc)

    # Only the newest unexpired code counts; requesting a new code retires older ones
    otp = session.exec(
        select(OtpCode)
        .where(OtpCode.phone == phone)
        .where(OtpCode.expires_at > now)
        .order_by(OtpCode.expires_at.desc())
    ).first()
    if not otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP code")
    if otp.attempts >= config.OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many wrong codes. Please request a new code.")

    if not secrets.compare_digest(otp.code, (payload.code or "").strip()):
        otp.attempts += 1
        session.add(otp)
        session.commit()
        if otp.attempts >= config.OTP_MAX_ATTEMPTS:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                                detail="Too many wrong codes. Please request a new code.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP code")

    # Find or create worker
    worker = session.exec(select(Worker).where(Worker.phone == phone)).first()
    if not worker:
        worker = Worker(phone=phone)
        session.add(worker)
        session.commit()
        session.refresh(worker)

    # Used: clear every code for this number
    for old in session.exec(select(OtpCode).where(OtpCode.phone == phone)).all():
        session.delete(old)
    session.commit()

    token = create_access_token(worker_id=worker.id, phone=worker.phone)
    return Token(access_token=token, token_type="bearer")


def _normalized(raw: str) -> str:
    try:
        return normalize_phone(raw)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("/me")
def get_me(worker: Worker = Depends(get_current_worker)):
    return worker
