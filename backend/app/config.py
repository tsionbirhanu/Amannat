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
