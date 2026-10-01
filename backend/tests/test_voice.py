import pytest
import uuid
from datetime import datetime, timezone
from sqlmodel import Session, select
from fastapi.testclient import TestClient

from app.main import app
from app.database import engine
from app.models import Agency, Contract, Report, Worker

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
    # No agency context and no name in the text: ask the worker which agency
    assert "which agency" in data["answer_text"]
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


def _unique_name():
    return f"Zephyr {uuid.uuid4().hex[:8]} Staffing"

@pytest.fixture
def agency_with_reports():
    with Session(engine) as session:
        agency = Agency(name=_unique_name(), verification_status="unverified")
        session.add(agency)
        session.commit()
        session.refresh(agency)
        for category in ["wage_nonpayment", "wage_nonpayment", "abuse"]:
            session.add(Report(worker_pseudo_id="pseudo", agency_id=agency.id, category=category))
        session.commit()
        session.refresh(agency)
        return agency

def test_voice_query_registry_answer_by_agency_id(headers, mock_voxide, agency_with_reports):
    payload = {"text": "is this agency safe?", "language": "en", "agency_id": agency_with_reports.id}
    resp = client.post("/voice/query", json=payload, headers=headers)
    assert resp.status_code == 200
    answer = resp.json()["answer_text"]
    assert agency_with_reports.name in answer
    assert "unverified" in answer
    assert "3 reports in the last 6 months" in answer
    assert "2 wage nonpayment" in answer

def test_voice_query_registry_answer_by_spoken_name(headers, mock_voxide, agency_with_reports):
    payload = {"text": f"can I trust {agency_with_reports.name}?", "language": "en"}
    resp = client.post("/voice/query", json=payload, headers=headers)
    assert resp.status_code == 200
    assert agency_with_reports.name in resp.json()["answer_text"]

def test_voice_report_matches_agency_exactly(headers, mock_voxide, agency_with_reports):
    payload = {"text": f"{agency_with_reports.name.lower()} did not pay me", "language": "en"}
    resp = client.post("/voice/report", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["agency_id"] == agency_with_reports.id
    assert data["agency_name_guess"] == agency_with_reports.name

def test_voice_report_matches_agency_with_typo(headers, mock_voxide, agency_with_reports):
    misspelled = agency_with_reports.name.replace("Zephyr", "Zefyr")
    payload = {"text": f"{misspelled} took my passport", "language": "en"}
    resp = client.post("/voice/report", json=payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["agency_id"] == agency_with_reports.id

def test_voice_report_no_agency_match(headers, mock_voxide):
    payload = {"text": "they took my passport", "language": "en"}
    resp = client.post("/voice/report", json=payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["agency_id"] is None
    assert resp.json()["agency_name_guess"] is None

def test_voice_report_does_not_submit_report(headers, mock_voxide, agency_with_reports):
    payload = {"text": f"{agency_with_reports.name} did not pay me", "language": "en"}
    client.post("/voice/report", json=payload, headers=headers)
    with Session(engine) as session:
        reports = session.exec(select(Report).where(Report.agency_id == agency_with_reports.id)).all()
        assert len(reports) == 3  # only the fixture's reports; the draft is not persisted
