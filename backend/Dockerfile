FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Run as an unprivileged user; uploads/ must stay writable
RUN useradd --create-home appuser && mkdir -p /app/uploads && chown -R appuser /app
USER appuser

# Render (and most hosts) pass the port in $PORT. Migrations run on every start;
# they are a no-op when the database is already up to date.
CMD ["sh", "-c", "alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
