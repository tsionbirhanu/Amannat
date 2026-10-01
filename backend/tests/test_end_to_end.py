"""UC-1 end-to-end: a worker checks an agency by voice before shortlisting it."""
import uuid
from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _login(monkeypatch) -> dict:
    """Register/verify a fresh worker via OTP and return auth headers."""
    sent = {}
    monkeypatch.setattr("app.routers.auth.send_otp_sms", lambda phone, code: sent.update(code=code))

    phone = f"+{uuid.uuid4().int % 10000000000:010d}"
    assert client.post("/auth/otp/request", json={"phone": phone}).status_code == 200
    resp = client.post("/auth/otp/verify", json={"phone": phone, "code": sent["code"]})
    assert resp.status_code == 200
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def test_uc1_check_agency_by_voice_and_shortlist(monkeypatch):
    monkeypatch.setattr("app.routers.voice.call_voxide_tts", lambda text: "stub://audio/mocked.mp3")

    # 1. Register/verify the worker via OTP
    worker_headers = _login(monkeypatch)
    assert client.get("/auth/me", headers=worker_headers).status_code == 200

    # 2. Create an agency
    agency_name = f"Oasis {uuid.uuid4().hex[:8]} Recruitment"
    resp = client.post("/agency/agencies", json={"name": agency_name})
    assert resp.status_code == 201
    agency_id = resp.json()["id"]

    # 3. A second worker with a placement at this agency reports it (prior history)
    reporter_headers = _login(monkeypatch)
    resp = client.post(
        "/workers/me/contracts",
        json={
            "agency_id": agency_id,
            "wage": 1200,
            "terms": "One rest day per week. Termination with 30 days notice.",
            "start_date": datetime.now(timezone.utc).isoformat(),
        },
        headers=reporter_headers,
    )
    assert resp.status_code == 200
    resp = client.post(
        "/report/reports",
        json={"agency_id": agency_id, "category": "wage_nonpayment", "description": "Unpaid for 2 months"},
        headers=reporter_headers,
    )
    assert resp.status_code == 201

    # 4. The first worker asks by voice whether the agency is safe
    resp = client.post(
        "/voice/query",
        json={"text": "is this agency safe", "language": "en", "agency_id": agency_id},
        headers=worker_headers,
    )
    assert resp.status_code == 200
    answer = resp.json()["answer_text"]
    assert agency_name in answer
    assert "1 report in the last 6 months" in answer
    assert "wage nonpayment" in answer

    # 5. Shortlist the agency
    resp = client.post("/agency/shortlist", json={"agency_id": agency_id}, headers=worker_headers)
    assert resp.status_code == 201

    # 6. The shortlist reflects the agency's current status
    resp = client.get("/agency/shortlist", headers=worker_headers)
    assert resp.status_code == 200
    shortlisted = [a for a in resp.json() if a["id"] == agency_id]
    assert len(shortlisted) == 1
    assert shortlisted[0]["verification_status"] == "unverified"

    details = client.get(f"/agency/agencies/{agency_id}").json()
    assert details["report_flags"] == [{"category": "wage_nonpayment", "count": 1}]
