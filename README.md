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

## Signing in

Login codes are delivered **free through a Telegram bot**. There is no paid SMS provider.

- **Development without a bot:** leave `TELEGRAM_BOT_TOKEN` empty. The code is printed in the
  backend terminal: `[SMS STUB] OTP for +251...: 123456`.
- **With the bot (local or deployed):** the worker links their number once in Telegram, then every
  code arrives there.

### Set up the Telegram bot (5 minutes, free)

1. In Telegram, open **@BotFather** → `/newbot` → pick a name (e.g. *Amannat*) and a username
   ending in `bot` (e.g. `AmannatSafetyBot`). BotFather replies with a **token**.
2. In `backend/.env`:
   ```
   TELEGRAM_BOT_TOKEN=123456789:AA...        # keep secret, never commit
   TELEGRAM_BOT_USERNAME=AmannatSafetyBot
   ```
3. Restart uvicorn. The log shows `Telegram bot polling started`.
4. Optional, in BotFather: `/setdescription`, `/setuserpic`, and `/setcommands` →
   `start - Link my phone number` and `stop - Unlink`.

How a worker signs in:
1. In the app they enter their number (with country code) and tap **Send code**.
2. The first time, the app shows **Open Telegram**. In the bot they press **Start** →
   **📱 Share my phone number**. Telegram only lets people share *their own* verified number,
   and the backend double-checks it.
3. Back in the app: **I've linked it, send code** → the code arrives in the bot → enter it.

Guardians who link their number in the same bot also receive **panic and missed check-in
alerts** there, free.

### Deploying

Set these on the server (in its environment variables, not in git):

| Variable | Value |
|----------|-------|
| `APP_ENV` | `production`: codes are never printed, and failed delivery shows an error |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` | from BotFather |
| `TELEGRAM_MODE` | `polling` (default) works on any host. Use `webhook` if you run **more than one** backend process, or on hosts that sleep when idle |
| `TELEGRAM_WEBHOOK_URL` | for webhook mode: `https://<your-api-domain>/telegram/webhook` |
| `TELEGRAM_WEBHOOK_SECRET` | for webhook mode: a long random string (`python -c "import secrets; print(secrets.token_urlsafe(32))"`) |

Run `alembic upgrade head` once against the production database (it adds the `telegramlink`
table and the `otpcode.attempts` column).

Built-in protection (adjust in `.env` if needed):

| Setting | Default | |
|---------|---------|---|
| `OTP_TTL_MINUTES` | 5 | code lifetime |
| `OTP_MAX_ATTEMPTS` | 5 | wrong guesses before the code is locked |
| `OTP_REQUESTS_PER_MINUTE` / `_PER_HOUR` | 1 / 5 | codes per phone number |

Codes are generated with `secrets` (cryptographically secure). Only the newest code for a number
works, and all codes are deleted after a successful login.

## Page → API map

| Page        | Endpoints |
|-------------|-----------|
| `/register` | `POST /auth/otp/request`, `POST /auth/otp/verify`, `GET /telegram/info` |
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
