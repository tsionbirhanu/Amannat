from fastapi import FastAPI
from app.routers import auth, workers, agency, report

app = FastAPI(title="Amannat API", version="0.2")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.include_router(agency.router, prefix="/agency", tags=["agency"])
app.include_router(report.router, prefix="/report", tags=["report"])


@app.get("/health")
def health():
    return {"status": "ok"}
