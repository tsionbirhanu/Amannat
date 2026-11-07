# Amannat — End-to-end test guide

A manual walkthrough of every screen, in the order a worker would use the app.
Each step lists **what to do**, **what you should see**, and **what to check** in the
backend terminal or the API docs. Follow it top to bottom: later steps reuse data from
earlier ones.

---

## 0. Setup (once)

### 0.1 Start both servers

Terminal 1 — backend (http://localhost:8000):

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt          # includes python-multipart for uploads
alembic upgrade head                     # only after pulling new migrations
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — frontend (http://localhost:3000):

```powershell
cd frontend
npm install
npm run dev
```

**Check:**

| URL | Expected |
|-----|----------|
| http://localhost:8000/health | `{"status":"ok"}` |
| http://localhost:8000/docs | Swagger UI listing auth, workers, agency, report, voice, safety, governance |
| http://localhost:3000 | Redirects to `/register` |

> Keep **Terminal 1 visible** during testing — login codes and SMS alerts are printed there.

### 0.2 Voxide key and browser

The voice assistant is **Voxide**, a live voice agent that runs in the browser. It needs the
publishable key in `frontend/.env.local`:

```
NEXT_PUBLIC_VOXIDE_PUBLIC_KEY=vox_pub_...
```

**Restart `npm run dev` after adding or changing it**: `NEXT_PUBLIC_` values are read at startup.
`localhost` is always allowed by Voxide. Before deploying, add your real domain to the
**domain whitelist** in the Voxide dashboard.

Voxide works in any current browser with a microphone (Chrome, Edge, Firefox, Safari). Off
`localhost` it needs **HTTPS** for mic access. Without a key, the assistant falls back to
**basic mode** (browser speech recognition: Chrome/Edge only, typing everywhere).

### 0.3 Make sure there is a test agency

Agency search and reports need at least one agency in the database. Check with:

http://localhost:8000/agency/search?q=a

If the list is empty, or you want a dedicated one, create it in Swagger
(`POST /agency/agencies` → *Try it out*) or from PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/agency/agencies `
  -ContentType 'application/json' `
  -Body '{"name":"Sunrise Test Agency","license_no":"TEST-001","phone":"+251900000001","location":"Addis Ababa","verification_status":"verified"}'
```

The steps below use **"Sunrise Test Agency"**. Swap in your agency's name if you used a different one.

---

## 1. Register and sign in — `/register`

| # | Do | Expect |
|---|----|--------|
| 1.1 | Open http://localhost:3000 | Language screen; "English" selected |
| 1.2 | Pick **Amharic**, then **Continue in Amharic** | Phone number screen |
| 1.3 | Enter `+251911000111`, tap **Send code** | "Enter your code" screen |
| 1.4 | Look at **Terminal 1** | `[SMS STUB] OTP for +251911000111: 123456` |
| 1.5 | Type the 6 digits, tap **Verify and continue** | You land on `/home` |

**Negative checks**

- Enter `000000` → red error *"Invalid or expired OTP code"*.
- Codes expire after **5 minutes**; an old code gives the same error.
- **Use a different number** goes back one step; **Back to language** goes back two.

**Check:** DevTools → Application → Local Storage → `localhost:3000` has `amannat_token`
and `amannat_lang = am`.

---

## 2. Home — `/home`

| # | Do | Expect |
|---|----|--------|
| 2.1 | Look at the header | "Good morning/afternoon/evening, XYZ" (last 3 characters of your worker id) and a green **Connected** dot |
| 2.2 | Look at "Next check-in" | **NOT SCHEDULED** for a new worker |
| 2.3 | Tap **I'm safe** | Button shows "Saving…", then "Checked in. Thank you — stay safe." |
| 2.4 | Look at "Next check-in" again | Now shows **IN 1 DAY** (4 daily check-ins were scheduled; the first was confirmed) |
| 2.5 | Tap **Change time** | Goes to `/safety` |

**Negative check:** stop the backend (Ctrl+C in Terminal 1) and reload `/home` → the dot turns
amber and reads **Offline • will sync later**. Start the backend again before continuing.

---

## 3. Trust registry — `/trust`

| # | Do | Expect |
|---|----|--------|
| 3.1 | Open **Trust** | Search box; "Type to search the registry" |
| 3.2 | Type `Sunrise` | After ~0.3 s: "1 agency found" and a card with name, location and license number |
| 3.3 | Search by license `TEST-001` or phone `+251900000001` | Same agency found |
| 3.4 | Tap the card | Details: **Government license verified**, "License no. TEST-001", **0** anonymous records, **Low** concern, "No worker reports recorded…" |
| 3.5 | Tap **Save agency** | "Saved to your shortlist." |
| 3.6 | Tap **Save agency** again | "Already in your shortlist." |
| 3.7 | Tap **Check a contract** | Goes to `/records` |

**Check:** Swagger `GET /agency/shortlist` (click **Authorize** and paste your token from
Local Storage) lists the agency.

---

## 4. Save a contract with photos — `/records`

### 4.1 Contract with pages (camera / upload)

| # | Do | Expect |
|---|----|--------|
| 4.1.1 | Open **Records** | **Take photos** is selected; a dark panel says "No pages yet" |
| 4.1.2 | Tap **Take photo** | Phone: the rear camera opens. Laptop: a file picker opens. Choose 1–2 images |
| 4.1.3 | — | Thumbnails appear, numbered 1, 2…; the badge reads "2 pages added" |
| 4.1.4 | Tap the **×** on a thumbnail | That page is removed |
| 4.1.5 | Switch to **Choose a PDF or photo**, tap **Add file**, pick a PDF | A PDF tile appears in the same list |
| 4.1.6 | Fill in: wage `1200`, hours `8`, start date = 2 months ago, agency = type `Sun`, pick **Sunrise Test Agency** from the dropdown | — |
| 4.1.7 | Terms: `Housekeeping. One rest day per week. Termination with 30 days notice.` | — |
| 4.1.8 | Tap **Save contract + N pages** | Goes to `/review` (no warnings, because the terms mention a rest day and termination) |

**Negative checks**

- Pick a `.txt` or `.exe` file → *"… is not a photo or PDF."*
- Pick a file over 10 MB → *"… is larger than 10 MB."*
- Tap Save with the wage empty → *"Please fill in the monthly wage, start date and the contract terms."*

**Check:** a folder `backend/uploads/<worker id>/<contract id>/` now holds the files.

### 4.2 Contract with missing terms (warning flags)

| # | Do | Expect |
|---|----|--------|
| 4.2.1 | Go back to Records, choose **Tell Voxide the terms** | Only the terms form is shown |
| 4.2.2 | Wage `900`, start date today, terms `Cleaning only.`, no agency → **Save contract** | Amber box: *Saved. Please check…* — **No weekly rest day mentioned**, **No termination terms mentioned** |

> Review always shows your **most recent contract by start date**. To keep step 5 about the
> contract from 4.1, give 4.2 an *earlier* start date than 4.1, or skip 4.2.

---

## 5. Review and wages — `/review`

| # | Do | Expect |
|---|----|--------|
| 5.1 | Open `/review` (desktop shows both panels; on mobile use the **1. Review / 2. Record** toggle) | "3 of 3 key terms found • Looks complete" for the 4.1 contract |
| 5.2 | Details table | Wage 1,200 • 8 hours per day • start date • End date **Ongoing** • your terms text |
| 5.3 | Tap ▶ **Listen to the contract summary** | The browser reads the contract summary aloud |
| 5.4 | Record panel → header | "WORKER XXXXXX" and "1 contract saved" (or 2) |
| 5.5 | Wage history | **Earned so far** ≈ 2 × 1,200 = 2,400 (2 months), Paid 0, **Still owed** 2,400 |
| 5.6 | **Add payment** → amount `1200`, date = last month → **Save payment** | "Payment saved." Paid 1,200, still owed ≈ 1,200, bar ≈ 50% |
| 5.7 | Saved evidence | One row per uploaded page ("Page 1 • photo.jpg • 230 KB") |
| 5.8 | Tap a page row | The photo or PDF opens in a new tab |
| 5.9 | Tap **Export record** | Downloads `amannat-record-XXXXXX.json` with worker, contracts and guardians |

If you saved the 4.2 contract last, step 5.1 instead shows "1 of 3 key terms found • 2 need
your attention" with two red **Missing** cards. That's the flagged path.

---

## 6. Safety hub — `/safety`

### 6.1 Guardians

| # | Do | Expect |
|---|----|--------|
| 6.1.1 | Open **Safety** | "No guardians yet…" |
| 6.1.2 | **Add** → name `Marta T.`, relation `Sister`, phone `+251911222333`, SMS → **Save** | Card "MT • Marta T. • Sister • sms" |
| 6.1.3 | Add guardians until you have 5, then try a 6th | Error *"Maximum 5 guardian contacts allowed"* |

### 6.2 Check-in

| # | Do | Expect |
|---|----|--------|
| 6.2.1 | Tap **Check in** | "Checked in. Your guardians know you are safe." The card shows the time and the next check-in |

### 6.3 Panic alert (press and hold)

| # | Do | Expect |
|---|----|--------|
| 6.3.1 | Tap the red card quickly and release | Nothing is sent (it needs a hold) |
| 6.3.2 | **Press and hold** for 3 s | The title changes to "Keep holding…", then a confirm box lists your guardians |
| 6.3.3 | Tap **Cancel** | The box closes; nothing is sent |
| 6.3.4 | Hold again → **Send alert** (allow location if asked) | "Urgent alert sent to your guardians." |
| 6.3.5 | Look at **Terminal 1** | `[ALERT SMS STUB] to +251911222333: PANIC ALERT from worker …` (one line per guardian) |

**Check:** Swagger `GET /safety/escalations` shows a `panic` escalation.

### 6.4 Hotlines

| # | Do | Expect |
|---|----|--------|
| 6.4.1 | Default country **Saudi Arabia** | 999, 19911 |
| 6.4.2 | Switch to UAE / Lebanon / Kuwait | 800-999, 800-111 / 112, 1744 / 112 |
| 6.4.3 | Tap a number (on a phone) | The dialler opens |

---

## 7. Voice assistant (Voxide) — `/assistant`

Do this after sections 4–6, so the agent has a contract, wages and guardians to talk about.

### 7.1 Connect

| # | Do | Expect |
|---|----|--------|
| 7.1.1 | Open the assistant (orange mic on Home) | Under the title: green **Live voice agent**. (Amber **Basic mode** means no key is loaded; see 0.2) |
| 7.1.2 | Tap the big mic, allow the microphone | "Connecting…", then **"I'm listening"** and the bars animate |
| 7.1.3 | Say *"Hello, what can you do?"* | YOU SAID shows your words; the agent answers out loud and the reply text appears |
| 7.1.4 | Tap the mic again | The session ends; the title returns to "Ask another question" |

The browser console (F12) should show no `[Voxide]` errors. In the Voxide dashboard → your
project, the session appears, and after the first connect the **manifest** lists the
Amannat capabilities below.

### 7.2 Capabilities: one line per test

Speak these, or type them in **"Or type your question…"**, which uses the same session. While a
capability runs, the title shows what it's doing (e.g. "Checking the agency…").

| Say | Capability | Expect |
|-----|-----------|--------|
| *"Is Sunrise Test Agency safe?"* | `checkAgencySafety` | Verified, licence TEST-001, and the report count (1 passport report after section 8) |
| *"Find agencies in Addis Ababa"* | `searchAgencies` | Lists matching agencies |
| *"I'm safe, check me in"* | `checkInSafe` | Confirms the check-in. `/home` "Next check-in" moves forward |
| *"What are the hotlines in Kuwait?"* | `getHotlines` | "112" |
| *"What does my contract say?"* | `getMyContract` | Reads the wage, dates and terms of your latest contract |
| *"How much am I still owed?"* | `getWageSummary` | Earned, paid and still owed, matching `/review` |
| *"I got paid 600 today"* | `logWagePayment` | A **confirm dialog** first; after OK, "recorded" and the new amount still owed. `/review` shows it |
| *"Who are my guardians?"* | `listGuardians` | Names and relations from section 6.1 |
| *"Take me to my wages"* | `navigate` | Opens `/review` **while the session keeps running** |
| *"My employer at Sunrise Test Agency is keeping my passport, I want to report it"* | `draftIncidentReport` | Opens `/incident` with the description, **Passport is being kept** and the agency filled in. **Nothing is sent**: you tick consent and press send yourself |
| *"Help, I'm in danger, alert my family"* | `sendUrgentAlert` | Dialog *"Send an urgent alert to your guardians now?"*. **Cancel**: nothing sent. **OK**: `[ALERT SMS STUB]` lines appear in Terminal 1 |

### 7.3 Session across pages

| # | Do | Expect |
|---|----|--------|
| 7.3.1 | During a live session, say *"open the safety page"* | `/safety` opens. A dark pill at the bottom reads **"Voxide • Listening  [Stop]"** |
| 7.3.2 | Keep talking on that page | The agent still answers |
| 7.3.3 | Tap **Stop** on the pill | The mic is released and the pill disappears |

### 7.4 Language

The agent uses the language picked at sign-in (Amharic → `am-ET`, Afaan Oromo → `om-ET`,
English → `en-US`, Arabic → `ar-SA`). Test one non-English language: re-register, pick
**Amharic**, and ask in Amharic.

### 7.5 Fallback (basic mode)

| # | Do | Expect |
|---|----|--------|
| 7.5.1 | Comment out `NEXT_PUBLIC_VOXIDE_PUBLIC_KEY` in `frontend/.env.local`, restart `npm run dev` | The assistant shows amber **Basic mode • browser voice** and no pill ever appears |
| 7.5.2 | Type `Is Sunrise Test Agency safe?` → **Ask** | *"Sunrise Test Agency is verified with … reports in the last 6 months."* (from `POST /voice/query`) |
| 7.5.3 | Chrome/Edge: tap the mic and ask the same | Browser speech recognition, same answer. Firefox: *"Voice input is not supported…"* |
| 7.5.4 | Restore the key and restart | Back to **Live voice agent** |

If Voxide is unreachable or the plan's minutes run out, the page switches to basic mode by itself
and shows *"Voxide is unavailable… Using basic mode. Retry Voxide"*.

---

## 8. Report an incident — `/incident`

You need the contract from **4.1** (linked to Sunrise Test Agency) for this.

| # | Do | Expect |
|---|----|--------|
| 8.1 | Assistant → **Review Report** (or go to `/incident`) | "Agency you worked with" is **pre-selected** with Sunrise Test Agency (your only contracted agency) |
| 8.2 | What happened: `My employer at Sunrise Test Agency is keeping my passport.` → **Fill in for me** | Concern becomes **Passport is being kept** |
| 8.3 | Tap ▶ **Listen before you decide** | Concern, agency and description are read aloud |
| 8.4 | **Save draft**, reload the page | The text and choices are restored |
| 8.5 | Tap **Consent & send** without ticking the box | *"Please tick the consent box before sending."* |
| 8.6 | Tick consent → **Consent & send** | "Report sent…", the badge changes to **Sent**, buttons are disabled |
| 8.7 | Go to **Trust**, open Sunrise Test Agency | **1** anonymous record, concern **Medium**, pattern "Passport held by employer • 1 report" |

**Rule checks (FR-2.3: only report agencies you worked with)**

- Sign in with a **new phone number** that has no contracts and open `/incident` → *"You can report an agency once you have saved a contract with it…"* with a link to Records.
- Describe an incident naming a *different* agency (e.g. "Gulf Horizons did not pay me") → the category fills in, but you get *"…you have no saved contract with them. Add that contract in Records first."*

Category keywords the guesser understands: *pay / wage / paid* → wages, *passport* →
passport, *hit / hurt / abuse* → abuse, *contract / different / changed* → contract changed.

---

## 9. Session and security checks

| # | Do | Expect |
|---|----|--------|
| 9.1 | Delete `amannat_token` from Local Storage and open `/home`, `/safety`, `/records`, `/review`, `/assistant` or `/incident` | Redirected to `/register` |
| 9.2 | `/trust` while logged out | Search still works (public). **Save agency** → "Sign in first to save agencies." |
| 9.3 | Wait for the token to expire (`JWT_EXPIRE_MINUTES`, default 60) and do any action | The backend returns 401, the token is cleared, and the next page load sends you to `/register` |
| 9.4 | Swagger: as worker B, call `GET /workers/me/contracts/{A's contract id}/documents` | **403** — workers cannot see each other's files |

---

## 10. Automated checks

```powershell
# Backend: 40 tests (they use the database in backend/.env)
cd backend
.\venv\Scripts\python -m pytest -q

# Frontend: lint + production build
cd ..\frontend
npx eslint src
npm run build
```

Expected: all pytest tests pass. `npm run build` lists all 12 routes. ESLint reports one
existing error in `src/components/ThemeToggle.js` (`setState` inside an effect), which is unrelated to
these flows.

---

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Red *"Cannot reach the server at http://localhost:8000"* | The backend isn't running, or it's on another port. Check `frontend/.env.local` and restart `npm run dev` after editing it |
| Browser console: *blocked by CORS policy* | Add the frontend's exact origin to `CORS_ORIGINS` in `backend/.env` and restart uvicorn |
| `next build` → *TypeError: generate is not a function* | An editor extension leaked `__NEXT_PRIVATE_*` variables into the terminal. Run through `npm run build` (the wrapper in `frontend/scripts/next.mjs` strips them), not `npx next build` |
| Upload fails: *Form data requires "python-multipart"* | `pip install -r requirements.txt` in the backend venv, then restart uvicorn |
| No OTP line in the terminal | You are looking at a different backend process, e.g. one started elsewhere on port 8000 |
| Mic says permission denied | Click the lock icon in the address bar → allow Microphone → reload |
| Assistant says **Basic mode** although the key is set | `NEXT_PUBLIC_VOXIDE_PUBLIC_KEY` must be in `frontend/.env.local` (not `backend/.env`) and start with `vox_pub_`; restart `npm run dev` |
| *"Voxide is unavailable"* / widget errors in console | Off localhost, the domain isn't on the Voxide dashboard whitelist, or the project is paused |
| Agent talks but never does anything | Check the dashboard manifest lists the capabilities; reload the page so they are re-uploaded |
| Review shows the wrong contract | It shows the contract with the latest start date (see the note in 4.2) |
