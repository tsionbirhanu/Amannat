from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.config import JWT_SECRET, JWT_EXPIRE_MINUTES

ALGORITHM = "HS256"

def create_access_token(worker_id: str, phone: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode = {"sub": worker_id, "phone": phone, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token")
