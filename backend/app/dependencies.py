from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from app.database import get_session
from app.security import decode_access_token
from app.models import Worker

# Using tokenUrl here so swagger UI provides an "Authorize" button correctly
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/otp/verify")

def get_current_worker(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> Worker:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        worker_id: str = payload.get("sub")
        if worker_id is None:
            raise credentials_exception
    except ValueError:
        raise credentials_exception
        
    worker = session.exec(select(Worker).where(Worker.id == worker_id)).first()
    if worker is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker not found")
    return worker
