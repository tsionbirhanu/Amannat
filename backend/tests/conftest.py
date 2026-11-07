import pytest

from app import config


@pytest.fixture(autouse=True)
def offline_and_relaxed_limits(monkeypatch):
    """Keep tests offline and repeatable.

    - Never talk to the real Telegram bot, even if TELEGRAM_BOT_TOKEN is in .env.
    - The test database is shared and persistent, and several tests reuse fixed
      phone numbers, so lift the login-code request limits by default.
      Tests that exercise the limits set them explicitly.
    """
    monkeypatch.setattr(config, "TELEGRAM_BOT_TOKEN", None)
    monkeypatch.setattr(config, "APP_ENV", "development")
    monkeypatch.setattr(config, "OTP_REQUESTS_PER_MINUTE", 1000)
    monkeypatch.setattr(config, "OTP_REQUESTS_PER_HOUR", 1000)
