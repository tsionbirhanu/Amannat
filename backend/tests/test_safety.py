import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from datetime import timedelta
import json
from unittest.mock import patch
import random

from app.main import app
from app.models import Worker, CheckIn, Escalation, GuardianContact, utc_now
from app.database import get_session, engine
from app.scheduler import checkin_job

client = TestClient(app)

@pytest.fixture
def test_worker():
    phone = f"+{random.randint(1000000000, 9999999999)}"
    worker = Worker(phone=phone, languages="en")
    with Session(engine) as session:
        session.add(worker)
        session.commit()
        session.refresh(worker)
    return worker

@pytest.fixture
def auth_headers(test_worker: Worker):
    from app.security import create_access_token
    token = create_access_token(worker_id=test_worker.id, phone=test_worker.phone)
    return {"Authorization": f"Bearer {token}"}

def test_schedule_checkins_weekly(test_worker: Worker, auth_headers: dict):
    response = client.post(
        "/safety/checkins/schedule",
        json={"frequency": "weekly", "channel": "app"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    
    # Verify in DB
    with Session(engine) as session:
        statement = select(CheckIn).where(CheckIn.worker_id == test_worker.id)
        checkins = session.exec(statement).all()
        assert len(checkins) == 4
        
        for c in checkins:
            assert c.status == "pending"

def test_confirm_checkin_wrong_worker(test_worker: Worker, auth_headers: dict):
    phone = f"+{random.randint(1000000000, 9999999999)}"
    other_worker = Worker(phone=phone, languages="en")
    
    with Session(engine) as session:
        session.add(other_worker)
        session.commit()
        
        checkin = CheckIn(worker_id=other_worker.id, scheduled_at=utc_now(), status="pending", channel="app")
        session.add(checkin)
        session.commit()
        checkin_id = checkin.id
    
    response = client.post(f"/safety/checkins/{checkin_id}/confirm", headers=auth_headers)
    assert response.status_code == 404

def test_confirm_checkin_success(test_worker: Worker, auth_headers: dict):
    with Session(engine) as session:
        checkin = CheckIn(worker_id=test_worker.id, scheduled_at=utc_now(), status="pending", channel="app")
        session.add(checkin)
        session.commit()
        checkin_id = checkin.id
    
    response = client.post(f"/safety/checkins/{checkin_id}/confirm", headers=auth_headers)
    assert response.status_code == 200
    
    with Session(engine) as session:
        checkin = session.get(CheckIn, checkin_id)
        assert checkin.status == "confirmed"

@patch("app.routers.safety.send_alert_sms")
def test_panic(mock_send_alert, test_worker: Worker, auth_headers: dict):
    with Session(engine) as session:
        guardian = GuardianContact(worker_id=test_worker.id, name="Test", relation="Friend", channel="sms", phone="+111")
        session.add(guardian)
        session.commit()
    
    response = client.post("/safety/panic", json={"lat": 1.0, "lng": 2.0}, headers=auth_headers)
    assert response.status_code == 200
    
    with Session(engine) as session:
        statement = select(Escalation).where(Escalation.worker_id == test_worker.id, Escalation.trigger_type == "panic")
        escalation = session.exec(statement).first()
        assert escalation is not None
        contacts = json.loads(escalation.notified_contacts_json)
        assert len(contacts) == 1
        assert contacts[0]["phone"] == "+111"
    
    # Verify the mock wasn't awaited inline but was queued as a task.
    # In TestClient, BackgroundTasks are executed after the response is returned, synchronously.
    mock_send_alert.assert_called_once_with("+111", f"PANIC ALERT from worker {test_worker.id}")

def test_get_hotlines(auth_headers: dict):
    response = client.get("/safety/hotlines?country=UAE", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "800-999" in response.json()

def test_scheduler_job(test_worker: Worker):
    now = utc_now()
    with Session(engine) as session:
        checkin1 = CheckIn(worker_id=test_worker.id, scheduled_at=now - timedelta(days=2), status="missed", channel="app")
        checkin2 = CheckIn(worker_id=test_worker.id, scheduled_at=now - timedelta(days=1), status="missed", channel="app")
        session.add(checkin1)
        session.add(checkin2)
        session.commit()
    
    checkin_job()
    
    with Session(engine) as session:
        statement = select(Escalation).where(Escalation.worker_id == test_worker.id, Escalation.trigger_type == "missed_checkin")
        escalations = session.exec(statement).all()
        assert len(escalations) == 1
    
    # Run again, should not create a second escalation
    checkin_job()
    
    with Session(engine) as session:
        escalations2 = session.exec(statement).all()
        assert len(escalations2) == 1

def test_scheduler_pending_to_missed(test_worker: Worker):
    now = utc_now()
    with Session(engine) as session:
        checkin1 = CheckIn(worker_id=test_worker.id, scheduled_at=now - timedelta(hours=1), status="pending", channel="app")
        session.add(checkin1)
        session.commit()
        checkin_id = checkin1.id
    
    checkin_job()
    
    with Session(engine) as session:
        checkin1 = session.get(CheckIn, checkin_id)
        assert checkin1.status == "missed"
