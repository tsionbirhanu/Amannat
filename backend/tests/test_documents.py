import uuid
import pytest
from sqlmodel import Session
from fastapi.testclient import TestClient

from app.main import app
from app.database import engine
from app.models import Worker
from app.security import create_access_token
import app.routers.workers as workers_router

client = TestClient(app)

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
PDF = b"%PDF-1.4\n%fake\n"


def _make_worker():
    with Session(engine) as session:
        worker = Worker(phone=f"+{uuid.uuid4().int % 10000000000}", languages="am")
        session.add(worker)
        session.commit()
        session.refresh(worker)
        return worker


def _headers(worker):
    return {"Authorization": f"Bearer {create_access_token(worker.id, worker.phone)}"}


@pytest.fixture(autouse=True)
def tmp_uploads(tmp_path, monkeypatch):
    monkeypatch.setattr(workers_router, "UPLOAD_DIR", str(tmp_path))
    return tmp_path


@pytest.fixture
def owner():
    return _make_worker()


@pytest.fixture
def contract_id(owner):
    resp = client.post(
        "/workers/me/contracts",
        json={"wage": 1000, "terms": "rest day, termination", "start_date": "2026-01-01T00:00:00Z"},
        headers=_headers(owner),
    )
    assert resp.status_code == 200
    return resp.json()["contract"]["id"]


def test_upload_list_and_download(owner, contract_id, tmp_uploads):
    h = _headers(owner)
    resp = client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("page1.png", PNG, "image/png")), ("files", ("contract.pdf", PDF, "application/pdf"))],
        headers=h,
    )
    assert resp.status_code == 200, resp.text
    docs = resp.json()["documents"]
    assert [d["name"] for d in docs] == ["page1.png", "contract.pdf"]
    assert docs[0]["size"] == len(PNG)

    listed = client.get(f"/workers/me/contracts/{contract_id}/documents", headers=h).json()["documents"]
    assert len(listed) == 2

    file_resp = client.get(f"/workers/me/contracts/{contract_id}/documents/{docs[1]['id']}", headers=h)
    assert file_resp.status_code == 200
    assert file_resp.content == PDF
    assert file_resp.headers["content-type"].startswith("application/pdf")

    # A second upload appends instead of replacing
    client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("page2.png", PNG, "image/png"))],
        headers=h,
    )
    listed = client.get(f"/workers/me/contracts/{contract_id}/documents", headers=h).json()["documents"]
    assert len(listed) == 3


def test_rejects_non_document_types(owner, contract_id):
    resp = client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("evil.exe", b"MZ...", "application/octet-stream"))],
        headers=_headers(owner),
    )
    assert resp.status_code == 415


def test_rejects_too_large(owner, contract_id, monkeypatch):
    monkeypatch.setattr(workers_router, "MAX_DOC_BYTES", 10)
    resp = client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("big.png", PNG, "image/png"))],
        headers=_headers(owner),
    )
    assert resp.status_code == 413


def test_other_worker_cannot_upload_or_read(owner, contract_id):
    resp = client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("page1.png", PNG, "image/png"))],
        headers=_headers(owner),
    )
    doc_id = resp.json()["documents"][0]["id"]

    intruder = _headers(_make_worker())
    assert client.get(f"/workers/me/contracts/{contract_id}/documents", headers=intruder).status_code == 403
    assert client.get(f"/workers/me/contracts/{contract_id}/documents/{doc_id}", headers=intruder).status_code == 403
    assert client.post(
        f"/workers/me/contracts/{contract_id}/documents",
        files=[("files", ("x.png", PNG, "image/png"))],
        headers=intruder,
    ).status_code == 403


def test_unknown_document_id_is_404(owner, contract_id):
    resp = client.get(f"/workers/me/contracts/{contract_id}/documents/..%2F..%2Fsecret", headers=_headers(owner))
    assert resp.status_code == 404
