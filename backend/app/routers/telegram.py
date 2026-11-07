import secrets
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Request

from app import config
from app.integrations import telegram

router = APIRouter()


@router.post("/webhook", include_in_schema=False)
async def telegram_webhook(
    request: Request,
    x_telegram_bot_api_secret_token: Optional[str] = Header(default=None),
):
    """Receives bot updates when TELEGRAM_MODE=webhook."""
    if not telegram.is_configured() or config.TELEGRAM_MODE != "webhook":
        raise HTTPException(status_code=404, detail="Not found")
    expected = config.TELEGRAM_WEBHOOK_SECRET
    if not expected or not secrets.compare_digest(x_telegram_bot_api_secret_token or "", expected):
        raise HTTPException(status_code=403, detail="Forbidden")
    telegram.handle_update(await request.json())
    return {"ok": True}


@router.get("/info")
def telegram_info():
    """Lets the app show the bot link before the first login attempt."""
    return {"enabled": telegram.is_configured(), "bot_url": telegram.bot_url()}
