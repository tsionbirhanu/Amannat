import secrets as pysecrets

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app import config
from app.database import engine
from app.integrations import telegram
from app.integrations.sms_gateway import send_alert_sms
from app.main import app
from app.models import OtpCode, TelegramLink
from app.phone import normalize_phone

client = TestClient(app)


def new_phone() -> str:
    return f"+2519{pysecrets.randbelow(10**8):08d}"


@pytest.fixture
def bot(monkeypatch):
    """Telegram 'configured', with the HTTP API replaced by a recorder."""
    calls = []

    def fake_call(method, payload=None, timeout=15):
        calls.append((method, payload or {}))
        return {}

    monkeypatch.setattr(config, "TELEGRAM_BOT_TOKEN", "test-token")
    monkeypatch.setattr(config, "TELEGRAM_BOT_USERNAME", "AmannatTestBot")
    monkeypatch.setattr(telegram, "_call", fake_call)
    return calls


def link(phone: str, chat_id: int = 555001, user_id: int = 777001):
    telegram.handle_update({
        "update_id": 1,
        "message": {
            "chat": {"id": chat_id},
            "from": {"id": user_id},
            "contact": {"phone_number": phone.lstrip("+"), "user_id": user_id},
        },
    })


def sent_texts(calls, chat_id=None):
    return [p["text"] for m, p in calls if m == "sendMessage" and (chat_id is None or p["chat_id"] == chat_id)]


# ---- phone normalisation ---------------------------------------------------------

@pytest.mark.parametrize("raw,expected", [
    ("+251 911-22 33 44", "+251911223344"),
    ("00251911223344", "+251911223344"),
    ("251911223344", "+251911223344"),
    ("(+966) 50 123 4567", "+966501234567"),
])
def test_normalize_phone(raw, expected):
    assert normalize_phone(raw) == expected


@pytest.mark.parametrize("raw", ["", "abc", "+0123456789", "+12345"])
def test_normalize_phone_rejects(raw):
    with pytest.raises(ValueError):
        normalize_phone(raw)


def test_request_rejects_invalid_phone():
    resp = client.post("/auth/otp/request", json={"phone": "hello"})
    assert resp.status_code == 400
    assert "international format" in resp.json()["detail"]


# ---- linking through the bot -----------------------------------------------------

def test_start_offers_share_button(bot):
    telegram.handle_update({"update_id": 1, "message": {"chat": {"id": 42}, "from": {"id": 42}, "text": "/start link"}})
    method, payload = bot[-1]
    assert method == "sendMessage"
    assert payload["reply_markup"]["keyboard"][0][0]["request_contact"] is True


def test_sharing_own_contact_links_phone(bot):
    phone = new_phone()
    link(phone, chat_id=9001, user_id=9001)
    with Session(engine) as s:
        row = s.get(TelegramLink, phone)
        assert row is not None and row.chat_id == 9001
    assert any("Linked" in t for t in sent_texts(bot, 9001))


def test_someone_elses_contact_is_rejected(bot):
    phone = new_phone()
    telegram.handle_update({
        "update_id": 1,
        "message": {"chat": {"id": 9002}, "from": {"id": 9002},
                    "contact": {"phone_number": phone, "user_id": 123456}},  # not the sender
    })
    with Session(engine) as s:
        assert s.get(TelegramLink, phone) is None
    assert any("your own" in t for t in sent_texts(bot, 9002))


def test_stop_unlinks(bot):
    phone = new_phone()
    link(phone, chat_id=9003, user_id=9003)
    telegram.handle_update({"update_id": 2, "message": {"chat": {"id": 9003}, "from": {"id": 9003}, "text": "/stop"}})
    with Session(engine) as s:
        assert s.get(TelegramLink, phone) is None


# ---- login codes over Telegram ---------------------------------------------------

def test_unlinked_phone_gets_bot_link_and_no_code(bot):
    phone = new_phone()
    resp = client.post("/auth/otp/request", json={"phone": phone})
    assert resp.status_code == 409
    detail = resp.json()["detail"]
    assert detail["code"] == "telegram_not_linked"
    assert detail["bot_url"] == "https://t.me/AmannatTestBot?start=link"
    with Session(engine) as s:
        assert s.exec(select(OtpCode).where(OtpCode.phone == phone)).first() is None


def test_linked_phone_receives_code_and_can_log_in(bot):
    phone = new_phone()
    link(phone, chat_id=9004, user_id=9004)
    resp = client.post("/auth/otp/request", json={"phone": phone})
    assert resp.status_code == 200
    assert resp.json()["channel"] == "telegram"

    with Session(engine) as s:
        code = s.exec(select(OtpCode).where(OtpCode.phone == phone)).first().code
    assert any(code in t for t in sent_texts(bot, 9004))

    # Same number typed differently still matches
    spaced = phone[:4] + " " + phone[4:7] + "-" + phone[7:]
    resp = client.post("/auth/otp/verify", json={"phone": spaced, "code": code})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_telegram_failure_is_reported(bot, monkeypatch):
    phone = new_phone()
    link(phone, chat_id=9005, user_id=9005)

    def boom(*a, **k):
        raise telegram.TelegramError("Forbidden: bot was blocked by the user")
    monkeypatch.setattr(telegram, "send_message", boom)

    resp = client.post("/auth/otp/request", json={"phone": phone})
    assert resp.status_code == 503
    assert resp.json()["detail"]["code"] == "delivery_failed"


def test_production_never_prints_codes(monkeypatch, capsys):
    monkeypatch.setattr(config, "APP_ENV", "production")
    resp = client.post("/auth/otp/request", json={"phone": new_phone()})
    assert resp.status_code == 503
    assert resp.json()["detail"]["code"] == "delivery_unavailable"
    assert "SMS STUB" not in capsys.readouterr().out


# ---- brute-force and spam protection ---------------------------------------------

def test_wrong_guesses_lock_the_code(monkeypatch):
    monkeypatch.setattr(config, "OTP_MAX_ATTEMPTS", 3)
    phone = new_phone()
    assert client.post("/auth/otp/request", json={"phone": phone}).status_code == 200
    with Session(engine) as s:
        code = s.exec(select(OtpCode).where(OtpCode.phone == phone)).first().code
    wrong = "000000" if code != "000000" else "111111"

    assert client.post("/auth/otp/verify", json={"phone": phone, "code": wrong}).status_code == 400
    assert client.post("/auth/otp/verify", json={"phone": phone, "code": wrong}).status_code == 400
    assert client.post("/auth/otp/verify", json={"phone": phone, "code": wrong}).status_code == 429
    # Even the right code no longer works
    assert client.post("/auth/otp/verify", json={"phone": phone, "code": code}).status_code == 429


def test_request_rate_limit(monkeypatch):
    monkeypatch.setattr(config, "OTP_REQUESTS_PER_MINUTE", 1)
    phone = new_phone()
    assert client.post("/auth/otp/request", json={"phone": phone}).status_code == 200
    resp = client.post("/auth/otp/request", json={"phone": phone})
    assert resp.status_code == 429


def test_new_code_replaces_old(monkeypatch):
    phone = new_phone()
    client.post("/auth/otp/request", json={"phone": phone})
    with Session(engine) as s:
        first = s.exec(select(OtpCode).where(OtpCode.phone == phone)).first().code
    client.post("/auth/otp/request", json={"phone": phone})
    with Session(engine) as s:
        codes = s.exec(select(OtpCode).where(OtpCode.phone == phone).order_by(OtpCode.expires_at.desc())).all()
    newest = codes[0].code
    if first != newest:
        assert client.post("/auth/otp/verify", json={"phone": phone, "code": first}).status_code == 400
    assert client.post("/auth/otp/verify", json={"phone": phone, "code": newest}).status_code == 200


# ---- webhook and alerts ----------------------------------------------------------

def test_webhook_requires_secret(bot, monkeypatch):
    monkeypatch.setattr(config, "TELEGRAM_MODE", "webhook")
    monkeypatch.setattr(config, "TELEGRAM_WEBHOOK_SECRET", "s3cret")
    update = {"update_id": 1, "message": {"chat": {"id": 1}, "from": {"id": 1}, "text": "/start"}}

    assert client.post("/telegram/webhook", json=update).status_code == 403
    assert client.post("/telegram/webhook", json=update,
                       headers={"X-Telegram-Bot-Api-Secret-Token": "wrong"}).status_code == 403
    resp = client.post("/telegram/webhook", json=update, headers={"X-Telegram-Bot-Api-Secret-Token": "s3cret"})
    assert resp.status_code == 200
    assert bot and bot[-1][0] == "sendMessage"


def test_webhook_disabled_in_polling_mode(bot):
    assert client.post("/telegram/webhook", json={}).status_code == 404


def test_alert_reaches_linked_guardian(bot):
    phone = new_phone()
    link(phone, chat_id=9006, user_id=9006)
    assert send_alert_sms(phone, "PANIC ALERT from worker x") is True
    assert any("PANIC ALERT" in t for t in sent_texts(bot, 9006))


def test_alert_to_unlinked_guardian_is_logged(bot, capsys):
    assert send_alert_sms(new_phone(), "MISSED CHECK-IN ALERT") is False
    assert "ALERT SMS STUB" in capsys.readouterr().out


def test_info_endpoint(bot):
    assert client.get("/telegram/info").json() == {"enabled": True, "bot_url": "https://t.me/AmannatTestBot?start=link"}
