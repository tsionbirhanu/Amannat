from fastapi import FastAPI

app = FastAPI(title="Amannat API", version="0.2")


@app.get("/health")
def health():
    return {"status": "ok"}
