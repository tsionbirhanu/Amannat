import random
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.main import app
from app.models import Worker
from app.database import engine

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


def decision_payload():
    return {
        "case_id": f"case-{uuid.uuid4()}",
        "ruling": "Agency found in breach of contract terms.",
        "published_summary": "Agency sanctioned for withholding wages."
    }


def test_create_decision_requires_auth():
    response = client.post("/governance/decisions", json=decision_payload())
    assert response.status_code == 401


def test_create_decision_and_list_publicly(auth_headers: dict):
    payload = decision_payload()
    response = client.post("/governance/decisions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["case_id"] == payload["case_id"]

    response = client.get("/governance/decisions")
    assert response.status_code == 200
    matches = [d for d in response.json() if d["case_id"] == payload["case_id"]]
    assert len(matches) == 1
    assert matches[0]["published_summary"] == payload["published_summary"]
    assert "created_at" in matches[0]
    assert "ruling" not in matches[0]


def test_list_decisions_without_auth_header():
    response = client.get("/governance/decisions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
