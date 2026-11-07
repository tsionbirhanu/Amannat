"""Delivery of login codes and safety alerts.

There is no paid SMS provider. Messages go out through the free Telegram bot
(app/integrations/telegram.py) to people who linked their number there. In
development, when the bot isn't configured, codes and alerts are printed to the
console instead. In production nothing is ever printed: an undeliverable login
code is an error the app shows to the user.
"""
import logging
from typing import Optional

from sqlmodel import Session

from app import config
from app.database import engine
from app.integrations import telegram
from app.phone import normalize_phone

log = logging.getLogger("amannat.delivery")


class OtpDeliveryError(Exception):
    """The login code could not be delivered. `code` tells the frontend what to show."""

    def __init__(self, code: str, message: str, bot_url: Optional[str] = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.bot_url = bot_url


def send_otp_sms(phone: str, code: str) -> str:
    """Deliver a login code. Returns the channel used ("telegram" or "console")."""
    if telegram.is_configured():
        with Session(engine) as session:
            chat_id = telegram.chat_for_phone(session, phone)
        if chat_id is None:
            raise OtpDeliveryError(
                "telegram_not_linked",
                "Link this phone number in the Amannat Telegram bot first, then tap Send code again.",
                telegram.bot_url(),
            )
        try:
            telegram.send_message(
                chat_id,
                f"🔐 Your Amannat code is <b>{code}</b>\n\n"
                f"It expires in {config.OTP_TTL_MINUTES} minutes. Never share it with anyone, "
                "including people who say they are from Amannat.",
            )
        except telegram.TelegramError as exc:
            log.warning("Telegram delivery failed for %s: %s", phone, exc)
            raise OtpDeliveryError(
                "delivery_failed",
                "We couldn't send the code to Telegram. If you blocked the bot, open it and press Start, then try again.",
                telegram.bot_url(),
            ) from exc
        return "telegram"

    if config.APP_ENV == "production":
        raise OtpDeliveryError("delivery_unavailable", "Login codes can't be sent right now. Please try again later.")
    print(f"[SMS STUB] OTP for {phone}: {code}")
    return "console"


def send_alert_sms(phone: str, message: str) -> bool:
    """Send a safety alert to a guardian. Returns True if it was delivered.

    Guardians receive alerts through Telegram once they've linked their number with
    the bot. Otherwise (and in development) the alert is logged.
    """
    if telegram.is_configured():
        try:
            normalized = normalize_phone(phone)
        except ValueError:
            normalized = phone
        with Session(engine) as session:
            chat_id = telegram.chat_for_phone(session, normalized)
        if chat_id is not None:
            try:
                telegram.send_message(chat_id, f"🚨 <b>Amannat safety alert</b>\n\n{message}")
                return True
            except telegram.TelegramError as exc:
                log.warning("Telegram alert to %s failed: %s", phone, exc)
    print(f"[ALERT SMS STUB] to {phone}: {message}")
    return False
