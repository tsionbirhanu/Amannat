from fastapi import FastAPI
from app.routers import auth

app = FastAPI(title="Amannat API", version="0.2")

app.include_router(auth.router, prefix="/auth", tags=["auth"])


@app.get("/health")
def health():
    return {"status": "ok"}
