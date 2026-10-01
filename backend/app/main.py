from fastapi import FastAPI
from app.routers import auth, workers, agency, report, voice, safety, governance
from app.scheduler import start_scheduler, stop_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(title="Amannat API", version="0.2", lifespan=lifespan)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.include_router(agency.router, prefix="/agency", tags=["agency"])
app.include_router(report.router, prefix="/report", tags=["report"])
app.include_router(voice.router, prefix="/voice", tags=["voice"])
app.include_router(safety.router, prefix="/safety", tags=["safety"])
app.include_router(governance.router, prefix="/governance", tags=["governance"])


@app.get("/health")
def health():
    return {"status": "ok"}
