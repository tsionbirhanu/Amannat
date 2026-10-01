import pytest
import uuid
from datetime import datetime, timezone
from sqlmodel import Session
from fastapi.testclient import TestClient

from app.main import app
from app.database import engine
from app.models import Worker, Contract

client = TestClient(app)

@pytest.fixture
def mock_voxide(monkeypatch):
    def mock_stt(url):
        return f"transcribed from {url}"
    def mock_tts(text):
        return "stub://audio/mocked.mp3"
        
    monkeypatch.setattr("app.routers.voice.call_voxide_stt", mock_stt)
    monkeypatch.setattr("app.routers.voice.call_voxide_tts", mock_tts)

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

def test_voice_query_text_only(headers, mock_voxide):
    payload = {"text": "is this agency safe?", "language": "en"}
    resp = client.post("/voice/query", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "preliminary records" in data["answer_text"]
    assert data["answer_audio_url"] == "stub://audio/mocked.mp3"

def test_voice_query_missing_input(headers, mock_voxide):
    payload = {"language": "en"}
    resp = client.post("/voice/query", json=payload, headers=headers)
    assert resp.status_code == 400

def test_voice_contract_read(headers, test_worker, mock_voxide):
    with Session(engine) as session:
        contract = Contract(
            worker_id=test_worker.id,
            wage=1500,
            terms_json="{}",
            start_date=datetime.now(timezone.utc)
        )
        session.add(contract)
        session.commit()
        session.refresh(contract)
        
    payload = {"contract_id": contract.id}
    resp = client.post("/voice/contract/read", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "1500" in data["text"]
    assert data["audio_url"] == "stub://audio/mocked.mp3"

def test_voice_contract_read_other_worker(headers, mock_voxide):
    with Session(engine) as session:
        other_worker = Worker(phone=f"+{uuid.uuid4().int % 10000000000}")
        session.add(other_worker)
        session.commit()
        session.refresh(other_worker)
        
        contract = Contract(
            worker_id=other_worker.id,
            wage=1500,
            terms_json="{}",
            start_date=datetime.now(timezone.utc)
        )
        session.add(contract)
        session.commit()
        session.refresh(contract)
        
    payload = {"contract_id": contract.id}
    resp = client.post("/voice/contract/read", json=payload, headers=headers)
    assert resp.status_code == 404

def test_voice_report_wage_nonpayment(headers, mock_voxide):
    payload = {"text": "he didn't pay me", "language": "en"}
    resp = client.post("/voice/report", json=payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["category_guess"] == "wage_nonpayment"

def test_voice_report_passport_confiscation(headers, mock_voxide):
    payload = {"text": "they took my passport", "language": "en"}
    resp = client.post("/voice/report", json=payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["category_guess"] == "passport_confiscation"
