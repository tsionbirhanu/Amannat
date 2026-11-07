import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
SMS_GATEWAY_API_KEY = os.getenv("SMS_GATEWAY_API_KEY")
VOXIDE_API_KEY = os.getenv("VOXIDE_API_KEY")

# Comma-separated list of frontend origins allowed to call the API
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if o.strip()
]

# Where uploaded contract photos/PDFs are stored (local disk; swap for S3 in production)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"))

# "development" prints login codes to the console when no delivery channel is set up.
# In "production" a code is never printed: it must be delivered (Telegram) or the request fails.
APP_ENV = os.getenv("APP_ENV", "development").lower()

# ---- Telegram bot (free login-code + alert delivery) ----
# Create a bot with @BotFather, then set the token and the bot's username (without @).
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN") or None
TELEGRAM_BOT_USERNAME = (os.getenv("TELEGRAM_BOT_USERNAME") or "").lstrip("@") or None
# "polling" (default): the server asks Telegram for new messages; works anywhere, no public URL.
# "webhook": Telegram POSTs to /telegram/webhook; needs a public HTTPS URL (TELEGRAM_WEBHOOK_URL).
TELEGRAM_MODE = os.getenv("TELEGRAM_MODE", "polling").lower()
# On Render, RENDER_EXTERNAL_URL (e.g. https://amannat-api.onrender.com) is set
# automatically, so the webhook URL doesn't need to be configured by hand there.
_render_url = os.getenv("RENDER_EXTERNAL_URL")
TELEGRAM_WEBHOOK_URL = os.getenv("TELEGRAM_WEBHOOK_URL") or (f"{_render_url.rstrip('/')}/telegram/webhook" if _render_url else None)
# Random string; Telegram echoes it in a header so we can reject forged webhook calls.
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET") or None

# ---- Login-code limits ----
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "5"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))          # wrong guesses per code
OTP_REQUESTS_PER_MINUTE = int(os.getenv("OTP_REQUESTS_PER_MINUTE", "1"))
OTP_REQUESTS_PER_HOUR = int(os.getenv("OTP_REQUESTS_PER_HOUR", "5"))
