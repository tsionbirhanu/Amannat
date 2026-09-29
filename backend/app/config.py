import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
SMS_GATEWAY_API_KEY = os.getenv("SMS_GATEWAY_API_KEY")
VOXIDE_API_KEY = os.getenv("VOXIDE_API_KEY")
