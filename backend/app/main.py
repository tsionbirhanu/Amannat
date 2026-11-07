from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routers import auth, workers, agency, report, voice, safety, governance
from app.routers import telegram as telegram_router
from app.integrations import telegram
from app.scheduler import start_scheduler, stop_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    telegram.start()  # no-op unless TELEGRAM_BOT_TOKEN is set
    yield
    telegram.stop()
    stop_scheduler()

app = FastAPI(title="Amannat API", version="0.2", lifespan=lifespan)

# Allow the Next.js frontend (a different origin) to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.include_router(agency.router, prefix="/agency", tags=["agency"])
app.include_router(report.router, prefix="/report", tags=["report"])
app.include_router(voice.router, prefix="/voice", tags=["voice"])
app.include_router(safety.router, prefix="/safety", tags=["safety"])
app.include_router(governance.router, prefix="/governance", tags=["governance"])
app.include_router(telegram_router.router, prefix="/telegram", tags=["telegram"])


@app.get("/health")
def health():
    return {"status": "ok"}
