import pytest
import uuid
from datetime import datetime, timedelta, timezone
from sqlmodel import Session
from fastapi.testclient import TestClient

from app.main import app
from app.database import engine
from app.models import Worker, Contract

client = TestClient(app)

@pytest.fixture
def test_worker():
    phone = f"+{uuid.uuid4().int % 10000000000}"
    with Session(engine) as session:
        worker = Worker(phone=phone, languages="am")
        session.add(worker)
        session.commit()
        session.refresh(worker)
        
        yield worker

@pytest.fixture
def auth_token(test_worker):
    from app.security import create_access_token
    return create_access_token(test_worker.id, test_worker.phone)

@pytest.fixture
def headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

def test_create_contract_missing_flags(headers):
    payload = {
        "wage": 0,
        "terms": "just working hard",
        "start_date": "2023-01-01T00:00:00Z"
    }
    resp = client.post("/workers/me/contracts", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "missing_wage" in data["flags"]
    assert "missing_rest_day_clause" in data["flags"]
    assert "missing_termination_clause" in data["flags"]

def test_create_contract_no_flags(headers):
    payload = {
        "wage": 500,
        "terms": "includes a REST day and early terminatION options.",
        "start_date": "2023-01-01T00:00:00Z"
    }
    resp = client.post("/workers/me/contracts", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["flags"]) == 0

def test_wage_summary(headers, test_worker):
    # Create contract 60 days ago
    start = datetime.now(timezone.utc) - timedelta(days=60)
    payload = {
        "wage": 1000,
        "terms": "normal",
        "start_date": start.isoformat()
    }
    resp = client.post("/workers/me/contracts", json=payload, headers=headers)
    contract_id = resp.json()["contract"]["id"]
    
    # Add wage logs
    client.post(f"/workers/me/contracts/{contract_id}/wage-log", json={"amount": 500, "paid_on": start.isoformat()}, headers=headers)
    client.post(f"/workers/me/contracts/{contract_id}/wage-log", json={"amount": 300, "paid_on": start.isoformat()}, headers=headers)
    
    # Get summary
    resp = client.get(f"/workers/me/contracts/{contract_id}/wage-summary", headers=headers)
    assert resp.status_code == 200
    summary = resp.json()
    
    # 60 days / 30 = 2.0 months exactly
    # 2.0 * 1000 = 2000 owed
    # 500 + 300 = 800 paid
    # 2000 - 800 = 1200 balance
    assert summary["total_owed"] == 2000.0
    assert summary["total_paid"] == 800.0
    assert summary["balance"] == 1200.0

def test_guardian_contacts_limit(headers):
    for i in range(5):
        payload = {
            "name": f"Contact {i}",
            "relation": "Friend",
            "channel": "sms",
            "phone": f"+100000000{i}"
        }
        resp = client.post("/workers/me/guardian-contacts", json=payload, headers=headers)
        assert resp.status_code == 200
        
    # 6th should fail
    resp = client.post("/workers/me/guardian-contacts", json={
        "name": "Contact 6",
        "relation": "Friend",
        "channel": "sms",
        "phone": "+1000000006"
    }, headers=headers)
    assert resp.status_code == 400

def test_wage_log_other_worker(headers):
    # create a contract for a different worker
    with Session(engine) as session:
        other_worker = Worker(phone=f"+{uuid.uuid4().int % 10000000000}")
        session.add(other_worker)
        session.commit()
        session.refresh(other_worker)
        
        contract = Contract(
            worker_id=other_worker.id,
            wage=1000,
            terms_json="{}",
            start_date=datetime.now(timezone.utc)
        )
        session.add(contract)
        session.commit()
        session.refresh(contract)
        
    # try to add a wage log to it
    payload = {"amount": 500, "paid_on": datetime.now(timezone.utc).isoformat()}
    resp = client.post(f"/workers/me/contracts/{contract.id}/wage-log", json=payload, headers=headers)
    assert resp.status_code == 403

def test_export_record(headers):
    resp = client.get("/workers/me/record/export", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "worker" in data
    assert "contracts" in data
    assert "guardian_contacts" in data
