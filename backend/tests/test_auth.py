import pytest
from datetime import datetime, timedelta, timezone
from sqlmodel import Session, select
from fastapi.testclient import TestClient

from app.main import app
from app.database import engine
from app.models import OtpCode

client = TestClient(app)

def test_otp_request():
    response = client.post("/auth/otp/request", json={"phone": "+1234567890"})
    assert response.status_code == 200
    assert response.json() == {"message": "OTP sent"}

def test_otp_verify_invalid_code():
    response = client.post("/auth/otp/verify", json={"phone": "+1234567890", "code": "000000"})
    assert response.status_code == 400

def test_otp_verify_success_and_me():
    phone = "+1987654321"
    
    # 1. Request OTP
    response = client.post("/auth/otp/request", json={"phone": phone})
    assert response.status_code == 200
    
    # Get the code from the db directly
    with Session(engine) as session:
        # Get the latest OTP for the phone
        otp = session.exec(select(OtpCode).where(OtpCode.phone == phone)).first()
        code = otp.code

    # 2. Verify OTP
    response = client.post("/auth/otp/verify", json={"phone": phone, "code": code})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    token = data["access_token"]
    
    # 3. Test /me endpoint
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["phone"] == phone

def test_me_without_token():
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_expired_otp():
    phone = "+1555555555"
    with Session(engine) as session:
        expires_at = datetime.now(timezone.utc) - timedelta(minutes=5)
        otp = OtpCode(phone=phone, code="123456", expires_at=expires_at)
        session.add(otp)
        session.commit()
        
    response = client.post("/auth/otp/verify", json={"phone": phone, "code": "123456"})
    assert response.status_code == 400
