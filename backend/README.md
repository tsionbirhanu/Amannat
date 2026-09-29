# Amannat Backend

## Setup Instructions

1. Create a Neon Postgres project
2. Copy `.env.example` to `.env` and fill in the pooled connection string
3. Run `pip install -r requirements.txt` (recommend doing this in a virtual environment)
4. Run `uvicorn app.main:app --reload`
5. Confirm `GET /health` returns `{"status": "ok"}`

## Migrations vs App Execution
- **Migrations**: Alembic requires a **direct (non-pooler)** Neon connection string to perform `alembic upgrade head`. Please temporarily use the direct connection string in `.env` when running migrations.
- **Application**: The running app (FastAPI via uvicorn) should use the **pooled** connection string for better performance.
