from fastapi import FastAPI
from app.routers import auth, workers, registry

app = FastAPI(title="Amannat API", version="0.2")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.include_router(registry.router, prefix="/registry", tags=["registry"])


@app.get("/health")
def health():
    return {"status": "ok"}
