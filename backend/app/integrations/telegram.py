"""Telegram bot: free delivery of login codes and safety alerts.

Linking (once per person):
  1. The worker (or a guardian) opens https://t.me/<bot>?start=link and presses Start.
  2. The bot replies with a "Share my phone number" button (request_contact).
  3. Telegram sends us the contact. We accept it only if contact.user_id is the
     sender's own id, i.e. they shared *their own* verified Telegram number.
  4. We store phone -> chat_id in TelegramLink.

Afterwards /auth/otp/request sends the 6-digit code to that chat, and panic /
missed-check-in alerts reach linked guardians the same way.

Updates arrive by long polling (default, works without a public URL) or by
webhook (POST /telegram/webhook), see TELEGRAM_MODE in app/config.py.
"""
import logging
import threading
from typing import Optional

import httpx
from sqlmodel import Session, select

from app import config
from app.database import engine
from app.models import TelegramLink, utc_now
from app.phone import normalize_phone

log = logging.getLogger("amannat.telegram")

SHARE_BUTTON = "📱 Share my phone number"


class TelegramError(Exception):
    pass


def is_configured() -> bool:
    return bool(config.TELEGRAM_BOT_TOKEN)


def bot_url(start: str = "link") -> Optional[str]:
    if not config.TELEGRAM_BOT_USERNAME:
        return None
    return f"https://t.me/{config.TELEGRAM_BOT_USERNAME}?start={start}"


def _call(method: str, payload: Optional[dict] = None, timeout: float = 15) -> dict:
    if not is_configured():
        raise TelegramError("Telegram bot is not configured")
    try:
        resp = httpx.post(
            f"https://api.telegram.org/bot{config.TELEGRAM_BOT_TOKEN}/{method}",
            json=payload or {},
            timeout=timeout,
        )
        data = resp.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise TelegramError(f"Telegram request failed: {exc.__class__.__name__}") from exc
    if not data.get("ok"):
        raise TelegramError(data.get("description", "Telegram returned an error"))
    return data.get("result")


def send_message(chat_id: int, text: str, reply_markup: Optional[dict] = None) -> None:
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_markup is not None:
        payload["reply_markup"] = reply_markup
    _call("sendMessage", payload)


def chat_for_phone(session: Session, phone: str) -> Optional[int]:
    link = session.get(TelegramLink, phone)
    return link.chat_id if link else None


# ---- incoming updates ------------------------------------------------------------

def _share_keyboard() -> dict:
    return {
        "keyboard": [[{"text": SHARE_BUTTON, "request_contact": True}]],
        "resize_keyboard": True,
        "one_time_keyboard": True,
    }


def handle_update(update: dict) -> None:
    """Process one Telegram update. Never raises: a bad update must not stop polling."""
    try:
        _handle_update(update)
    except Exception:  # noqa: BLE001 - log and keep the bot alive
        log.exception("Failed to handle Telegram update %s", update.get("update_id"))


def _handle_update(update: dict) -> None:
    message = update.get("message")
    if not message:
        return
    chat_id = message["chat"]["id"]
    sender_id = message.get("from", {}).get("id")
    contact = message.get("contact")

    if contact:
        if contact.get("user_id") != sender_id:
            send_message(chat_id, "Please share <b>your own</b> number using the button below.", _share_keyboard())
            return
        try:
            phone = normalize_phone(contact.get("phone_number", ""))
        except ValueError:
            send_message(chat_id, "Sorry, I couldn't read that phone number.")
            return
        with Session(engine) as session:
            link = session.get(TelegramLink, phone)
            if link:
                link.chat_id, link.telegram_user_id, link.linked_at = chat_id, sender_id, utc_now()
            else:
                session.add(TelegramLink(phone=phone, chat_id=chat_id, telegram_user_id=sender_id))
            session.commit()
        send_message(
            chat_id,
            f"✅ Linked <b>{phone}</b>.\n\nGo back to Amannat and tap <b>Send code</b>. "
            "Your login codes and safety alerts will arrive here.\n\nSend /stop to unlink.",
            {"remove_keyboard": True},
        )
        return

    text = (message.get("text") or "").strip()
    if text.startswith("/stop"):
        with Session(engine) as session:
            for link in session.exec(select(TelegramLink).where(TelegramLink.chat_id == chat_id)).all():
                session.delete(link)
            session.commit()
        send_message(chat_id, "Unlinked. You will no longer receive Amannat codes or alerts here.", {"remove_keyboard": True})
        return

    # /start, /start link, or anything else: explain and offer the share button
    send_message(
        chat_id,
        "👋 This is the <b>Amannat</b> bot.\n\n"
        "Tap the button below to link your phone number. Amannat will then send your "
        "6-digit login codes here, for free.\n\n"
        "Guardians: link your number too, to receive safety alerts.",
        _share_keyboard(),
    )


# ---- polling / webhook lifecycle -------------------------------------------------

_stop = threading.Event()
_thread: Optional[threading.Thread] = None


def _poll_loop() -> None:
    offset = None
    try:
        _call("deleteWebhook", {"drop_pending_updates": False})
    except TelegramError as exc:
        log.warning("Could not clear Telegram webhook: %s", exc)
    while not _stop.is_set():
        try:
            updates = _call("getUpdates", {"offset": offset, "timeout": 25, "allowed_updates": ["message"]}, timeout=35)
            for update in updates:
                offset = update["update_id"] + 1
                handle_update(update)
        except TelegramError as exc:
            log.warning("Telegram polling error: %s", exc)
            _stop.wait(5)


def start() -> None:
    """Called on app startup."""
    global _thread
    if not is_configured():
        return
    if config.TELEGRAM_MODE == "webhook":
        if not config.TELEGRAM_WEBHOOK_URL:
            log.error("TELEGRAM_MODE=webhook but TELEGRAM_WEBHOOK_URL is not set")
            return
        payload = {"url": config.TELEGRAM_WEBHOOK_URL, "allowed_updates": ["message"]}
        if config.TELEGRAM_WEBHOOK_SECRET:
            payload["secret_token"] = config.TELEGRAM_WEBHOOK_SECRET
        try:
            _call("setWebhook", payload)
            log.info("Telegram webhook set to %s", config.TELEGRAM_WEBHOOK_URL)
        except TelegramError as exc:
            log.error("Could not set Telegram webhook: %s", exc)
        return
    _stop.clear()
    _thread = threading.Thread(target=_poll_loop, name="telegram-poll", daemon=True)
    _thread.start()
    log.info("Telegram bot polling started")


def stop() -> None:
    _stop.set()
