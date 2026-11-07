# Amannat

- `backend/` — FastAPI API (Neon Postgres)
- `frontend/` — Next.js app that calls the API

Full manual test walkthrough: [TESTING.md](TESTING.md)

## Run locally

Open two terminals.

**Backend** → http://localhost:8000 (API docs at `/docs`)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env      # first time only, then fill in DATABASE_URL
uvicorn app.main:app --reload --port 8000
```

**Frontend** → http://localhost:3000

```powershell
cd frontend
npm install
copy .env.example .env.local   # first time only
npm run dev
```

## How they connect

- The frontend reads the API address from `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
  (default `http://localhost:8000`). Restart `npm run dev` after changing it.
- The backend allows browser calls from the origins in `CORS_ORIGINS` in `backend/.env`
  (default `http://localhost:3000,http://127.0.0.1:3000`).
- All API calls go through `frontend/src/lib/api.js`. The login token is kept in `localStorage`
  and sent as `Authorization: Bearer <token>`.

## Signing in (development)

1. Open http://localhost:3000, choose a language, enter a phone number.
2. The SMS gateway is still a stub, so the code is **printed in the backend terminal**:
   `[SMS STUB] OTP for +251...: 123456`
3. Enter that code. You are taken to `/home`.

## Page → API map

| Page        | Endpoints |
|-------------|-----------|
| `/register` | `POST /auth/otp/request`, `POST /auth/otp/verify` |
| `/home`     | `GET /auth/me`, `GET /safety/checkins`, check-in confirm |
| `/assistant`| Voxide live voice agent (`src/lib/voxide.js`) calling the endpoints below as capabilities; falls back to `POST /voice/query` + browser speech |
| `/trust`    | `GET /agency/search`, `GET /agency/agencies/{id}`, `POST /agency/shortlist` |
| `/records`  | `POST /workers/me/contracts`, `POST /workers/me/contracts/{id}/documents` (photos/PDFs) |
| `/review`   | `GET /workers/me/contracts`, wage summary / wage log, `POST /voice/contract/read`, `GET /workers/me/record/export`, contract documents |
| `/safety`   | check-ins, `POST /safety/panic`, `GET /safety/hotlines`, guardian contacts |
| `/incident` | `POST /voice/report`, `POST /report/reports` |

## Notes

- **Voice (Voxide):** a browser SDK (`@voxide/react`). Put the publishable key in
  `frontend/.env.local` as `NEXT_PUBLIC_VOXIDE_PUBLIC_KEY=vox_pub_...` and restart `npm run dev`.
  Capabilities the agent can call are defined in `frontend/src/lib/voxide.js`. Add your production
  domain to the Voxide dashboard whitelist before deploying (localhost is always allowed).

- Contract photos/PDFs are stored on local disk in `backend/uploads/` (git-ignored, configurable with
  `UPLOAD_DIR`). Max 10 MB per file, 20 per contract.
- `npm run dev/build/start` go through `frontend/scripts/next.mjs`, which strips `__NEXT_PRIVATE_*`
  variables that some editor extensions leak into terminals (they break `next build`).
