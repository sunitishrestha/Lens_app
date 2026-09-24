# JobLens

JobLens is a TypeScript mobile app for Expo Go, with a Python FastAPI backend and PostgreSQL database. It supports creating an account, logging in, receiving a JWT access token, persisting the session across app restarts with role-based navigation (`hire` vs `work`), hirers posting job vacancies, workers browsing and applying to them, and hirers seeing how many people applied to each job.

## Project structure

```text
JobLens/
├── frontend/             # Expo SDK 54 + React Native + TypeScript app
│   ├── App.tsx              # Restores session on boot, renders AppNavigator
│   ├── app.json             # Expo settings and phone-to-API address
│   └── src/
│       ├── api/              # Typed FastAPI requests (auth.ts, client.ts, vacancies.ts, application.ts)
│       ├── store/             # Zustand auth store (authStore.tsx)
│       ├── navigation/         # AppNavigator, AuthStack, HireStack, WorkStack, types.ts
│       └── screen/            # Login, registration, hire/work dashboards, profile
├── backend/              # FastAPI application
│   └── app/
│       ├── routers/         # auth, vacancies, applications
│       ├── models/           # user, vacancy, application (SQLAlchemy)
│       ├── schema/           # auth, vacancy, application (Pydantic)
│       ├── core/              # security.py (hashing/JWT), deps.py (auth dependencies)
│       └── database.py        # DB engine/session setup
└── docker-compose.yml    # PostgreSQL and FastAPI containers
```

## What is complete

### Backend — Auth

- FastAPI API with Swagger documentation at `/docs`.
- PostgreSQL database via Docker.
- `users` table with full name, email, password hash, role (`hire` | `work`), and creation time.
- Passwords are hashed with Argon2 (`pwdlib`); raw passwords are never stored.
- JWT authentication tokens are created on login and validated on protected routes via a `get_current_user` dependency (`app/core/deps.py`).
- `require_role("hire")` / `require_role("work")` dependency restricts endpoints by role — e.g. only `hire` users can post a vacancy, only `work` users can apply to one.
- CORS is enabled for development.

### Backend — Vacancies & Applications (built this session)

This is the core "job board" logic connecting hirers and workers:

- **`app/models/vacancy.py`** — `Vacancy` table: title, category, description, location, price, status (`open`/`closed`), linked to the hirer via `hirer_id` (foreign key to `users.id`).
- **`app/models/application.py`** — `Application` table: links a `vacancy_id` to an `applicant_id` (the worker), with a `status` field (`applied` / `shortlisted` / `hired` / `rejected`). A unique constraint on `(vacancy_id, applicant_id)` stops the same worker from applying twice to the same job.
- **`app/schema/vacancy.py`** and **`app/schema/application.py`** — Pydantic request/response contracts, including an `applicant_count` field computed per vacancy so the hire dashboard can show live numbers without a separate request.
- **Routers:**

  | Method  | Route                               | Who    | Purpose                                                                       |
  | ------- | ----------------------------------- | ------ | ----------------------------------------------------------------------------- |
  | `POST`  | `/api/v1/vacancies`                 | `hire` | Create a new job posting                                                      |
  | `GET`   | `/api/v1/vacancies`                 | anyone | Public feed of all open vacancies (used by Work dashboard)                    |
  | `GET`   | `/api/v1/vacancies/mine`            | `hire` | This hirer's own posted jobs, with applicant counts                           |
  | `GET`   | `/api/v1/vacancies/{id}`            | anyone | Single vacancy detail                                                         |
  | `POST`  | `/api/v1/applications`              | `work` | Apply to a vacancy (blocks duplicate applications)                            |
  | `GET`   | `/api/v1/applications/me`           | `work` | A worker's own list of applications                                           |
  | `GET`   | `/api/v1/applications/vacancy/{id}` | `hire` | See everyone who applied to one of your own vacancies (with their name/email) |
  | `PATCH` | `/api/v1/applications/{id}/status`  | `hire` | Update an applicant's status (shortlist / hire / reject)                      |

- Ownership checks are enforced server-side: a hirer can only view/manage applicants for vacancies **they themselves** posted (checked via `vacancy.hirer_id == current_user.id`), not any hirer's jobs.

### Frontend — State & Navigation

- **Session state managed globally with Zustand** (`src/store/authStore.tsx`):
  - `login(response)` — stores the JWT in `expo-secure-store`, sets `user` in state.
  - `logout()` — clears the token, resets state.
  - `restoreSession()` — on app boot, reads the token and calls `GET /auth/me` to re-hydrate the logged-in user, so sessions survive closing/reopening the app.
- **Navigation via React Navigation** (`@react-navigation/native` + `@react-navigation/native-stack`):
  - `AppNavigator.tsx` reads `user` from the store and renders `AuthStack`, `HireStack`, or `WorkStack` based on `user.role`, wrapped in one `NavigationContainer`.
  - Screens use `navigation.navigate(...)` (typed via `NativeStackScreenProps` and a shared `AuthStackParamList` in `src/navigation/types.ts`) instead of manually passed-in callback props.

### Frontend — Vacancies & Applications (built this session)

- **`src/api/vacancies.ts`** — typed functions: `createVacancy`, `listVacancies`, `myVacancies`, `getVacancy`.
- **`src/api/application.ts`** — typed functions: `applyToVacancy`, `myApplications`, `applicantsForVacancy`, `updateApplicationStatus`.
- **Hire dashboard (`HireHomepage.tsx`)** now:
  - Shows the real logged-in hirer's name (`user.full_name` from the auth store) instead of static text.
  - Fetches `myVacancies()` on load and replaces the hardcoded "12 active jobs / 148 applicants" stat cards with real counts computed from the response.
  - Replaces the two hardcoded demo project cards with a live list of the hirer's own posted vacancies, each showing real title, status (open/closed), location, and applicant count.
  - Tapping a posted vacancy opens the applicant review screen, where the hirer can search applicants and select a worker for hire.
- **Work dashboard (`WorkHomepage.tsx`)** now:
  - Shows the real logged-in worker's name instead of the hardcoded `userName = "Alex"` default prop.
  - Fetches `listVacancies()` (the public open-jobs feed) instead of using the hardcoded `EVENTS` array.
  - Tapping a job card opens the application form with the selected vacancy details.
  - Each card shows a live applicant count pulled from the backend.
- **Worker application form (`WorkApply.tsx`)** now:
  - Collects a portfolio link, message, availability confirmation, and equipment selections.
  - Sends the completed form to `POST /api/v1/applications` and shows a success/error alert.
  - Prevents submission until the worker confirms full availability and disables the submit button while sending.
- **Hire applicant review (`HireJobapplicant.tsx`)** now:
  - Loads the selected vacancy and its applications from the backend.
  - Displays each applicant's name, email, application date, and status.
  - Allows the hirer to update an applicant to `hired`.

## What has already been run

```powershell
# Backend
docker compose config
docker compose up --build -d
docker compose ps

# Verified the database schema directly
docker exec -it joblens-db-1 psql -U joblens -d joblens
# \dt
# SELECT * FROM users;
# (after this session's backend work, \dt should also show vacancies and applications)

# Frontend dependencies
npx expo install zustand @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx tsc --noEmit
```

The API was tested successfully with this flow:

1. `GET /health` returned `{"status":"ok"}`.
2. A test user registered, logged in, and `GET /api/v1/auth/me` returned that user.
3. Confirmed via `psql` that registered users appear in `users` with Argon2-hashed passwords (never plaintext).

**Not yet re-verified after this session's vacancy/application backend code was added** — before relying on it, run through this checklist:

1. `docker compose up --build -d` (rebuild so the new models/routers are picked up).
2. In `/docs`, log in as a `hire` user → `POST /api/v1/vacancies` → create a job.
3. `GET /api/v1/vacancies` → confirm it appears in the public feed.
4. Log in as a `work` user → open the job from the worker dashboard → submit the application form.
5. Back as the hire user → `GET /api/v1/applications/vacancy/{vacancy_id}` → confirm the applicant shows with name/email.
6. `GET /api/v1/vacancies/mine` as the hire user → confirm `applicant_count` is now `1`.
7. In the hire dashboard, tap the posted job → confirm the applicant review screen shows the new application and its status.
8. In `psql`, run `\dt` and confirm `vacancies` and `applications` tables exist; `SELECT * FROM vacancies;` / `SELECT * FROM applications;` to see the rows.

Only once all of that passes in Swagger/psql should the frontend screens be trusted end-to-end on a phone.

## Prerequisites

- Docker Desktop running
- Node.js **20.19 or newer**
- Expo Go SDK 54 on your Android phone
- Computer and phone connected to the same Wi-Fi

## Run the backend

From the project root:

```powershell
cd C:\Users\sophi\OneDrive\Desktop\JobLens
docker compose up --build -d
```

Check its status:

```powershell
docker compose ps
Invoke-RestMethod http://localhost:8000/health
```

Open the interactive API documentation in a browser:

```text
http://localhost:8000/docs
```

Check the database directly if needed:

```powershell
docker exec -it joblens-db-1 psql -U joblens -d joblens
```

Inside `psql`, useful commands while developing:

```sql
\pset pager off      -- stop results from paginating and hiding rows
\x                    -- expanded display, one column per line (easier to read)
\dt                   -- list all tables
\d+ vacancies         -- full column details for one table
SELECT * FROM users;
SELECT * FROM vacancies;
SELECT * FROM applications;
```

Stop the backend when you are finished:

```powershell
docker compose down
```

`docker compose down` stops the services but keeps your PostgreSQL data volume. Do not use `docker compose down -v` unless you intentionally want to erase the local database.

## Run the frontend in Expo Go

Open a new terminal and run:

```powershell
cd C:\Users\sophi\OneDrive\Desktop\JobLens\frontend
npm install
npx expo install --fix
npx tsc --noEmit
npx expo start --tunnel
```

Then scan the QR code with Expo Go. For quicker iteration during development, `npx expo start --web` also works in a browser.

### Important: API address for your phone

Expo Go runs on the phone, so `localhost` means the phone itself—not your computer. The frontend is currently configured to call:

```text
http://192.168.1.69:8000/api/v1
```

This address is in `frontend/app.json`:

```json
"extra": {
  "apiUrl": "http://192.168.1.69:8000/api/v1"
}
```

If your Wi-Fi address changes, find the new address and update `apiUrl`:

```powershell
ipconfig
```

Use the IPv4 Address listed under **Wireless LAN adapter Wi-Fi**. Keep the phone and computer on the same Wi-Fi. If Windows Firewall asks, allow access to port `8000`.

## Test from the app

1. Start the backend.
2. Start Expo with the frontend command above.
3. Scan the QR code in Expo Go.
4. Tap **Sign Up**, choose a role, provide a name, valid email, password of at least eight characters, and accept the terms.
5. Return to Login and sign in using the new account.
6. Close and reopen the app — you should stay logged in (session restored from SecureStore via `restoreSession()`).
7. As a `hire` account: use the Post a Job flow to create a vacancy, and see it appear on your dashboard with a real applicant count.
8. As a `work` account: browse the open jobs feed and apply to one; confirm the applicant count on the hirer's side goes up.
9. Log out from the profile screen and confirm you're returned to the Login screen.

## Current limitations / next work

- Only an access token is issued — there is no refresh token yet, so the session expires when the JWT expires (no silent refresh).
- Password reset, Google login, and Apple login buttons are visual only.
- The Hire dashboard's "New Applicants" feed (recent applicants across _all_ of a hirer's jobs) is not built yet — currently only per-vacancy applicant lists are available via `applicantsForVacancy(vacancyId)`.
- Vacancy posts have no image/photo field yet — job cards are currently text-only.
- Database tables are created automatically at startup via `Base.metadata.create_all()`; production should use Alembic migrations instead.
- `JWT_SECRET` and CORS settings are development values. Change them before deployment.

## Useful files

- `frontend/package.json` — Expo SDK 54 dependencies (zustand, react-navigation)
- `frontend/app.json` — application name and API address
- `frontend/src/api/auth.ts` — login and registration requests
- `frontend/src/api/vacancies.ts` — create/list/get vacancy requests
- `frontend/src/api/application.ts` — apply/list/update application requests
- `frontend/src/api/client.ts` — typed fetch wrapper with auth token injection
- `frontend/src/store/authStore.tsx` — global auth state (login/logout/restoreSession)
- `frontend/src/navigation/AppNavigator.tsx` — role-based root navigator
- `frontend/src/navigation/types.ts` — shared navigation param list types
- `backend/.env` — local API and database configuration
- `backend/app/main.py` — FastAPI entry point
- `backend/app/models/vacancy.py`, `backend/app/models/application.py` — job board data models
- `backend/app/routers/vacancy.py`, `backend/app/routers/application.py` — job board API routes
- `docker-compose.yml` — containers to run locally
