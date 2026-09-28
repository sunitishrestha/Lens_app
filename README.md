# JobLens

JobLens is a job board for camera and film professionals, built as a mobile app (Expo Go) with a Python FastAPI backend and a PostgreSQL database.

There are two kinds of accounts:

- **Hire** (producers/studios): post jobs, see who applied, view applicant profiles, hire someone, delete a job.
- **Work** (camera professionals): browse open jobs, fill in an application form, see "you've been hired" notifications, manage a profile with a photo.

This README is written so that you can come back after a break and understand **what exists, why it was built that way, how to run it, and what went wrong before**.

---

## 1. Feature status

| Feature                                                           | Status                                                                                        |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Register / login / JWT / `GET /auth/me`                           | ✅ Confirmed working                                                                          |
| Session survives closing the app (SecureStore + `restoreSession`) | ✅ Confirmed working                                                                          |
| Role-based navigation (hire vs work)                              | ✅ Confirmed working                                                                          |
| Hire posts a job from the app (`HirePostEvent`)                   | ✅ Confirmed working (job appears on the Work dashboard)                                      |
| Work dashboard lists real open jobs                               | ✅ Confirmed working                                                                          |
| Worker submits application form (portfolio, message, equipment)   | ✅ Confirmed working (applicant shows on the hire side)                                       |
| Hire dashboard shows real job list and applicant counts           | ✅ Confirmed working                                                                          |
| Profile screens show the logged-in user's real data               | ✅ Confirmed working                                                                          |
| Profile photo upload from phone gallery (stored on server + DB)   | ✅ Confirmed working                                                                          |
| Hire taps "View Profile" on an applicant (`WorkerProfileView`)    | 🟡 Code + route registered, re-test after last fix                                            |
| "Select & Hire" confirmation popup + notification row created     | 🟡 Written, needs end-to-end test                                                             |
| Work "Notifications" tab listing jobs you were hired for          | 🟡 Written, needs end-to-end test                                                             |
| Delete a job (backend + trash icon)                               | 🟡 Backend delete works after fix; confirmation popup still needs checking (see Known issues) |
| Refresh tokens, password reset, social login                      | ❌ Not built                                                                                  |
| Real "New Applicants" feed on the hire dashboard                  | ❌ Still hardcoded demo rows                                                                  |

---

## 2. How the app works (big picture)

```text
HIRE user                                   WORK user
---------                                   ---------
Post a Job  ──POST /vacancies──►  vacancies table  ◄──GET /vacancies──  Work dashboard lists it
                                                                            │
                                                                     tap "Apply Now"
                                                                            ▼
                                   applications table  ◄──POST /applications──  Application form
      │
Tap the job card ──GET /applications/vacancy/{id}──► applicant list (name, email, status)
      │
"View Profile" ──GET /applications/applicant/{id}──► that worker's bio/skills/photo
      │
"Select & Hire" ──PATCH /applications/{id}/status = hired──► also inserts a row in notifications
                                                                            │
                                            Work "Notifications" tab ◄──GET /applications/me/hired
```

Key idea: **the database is the single source of truth.** The hirer's dashboard and the worker's feed both read the same `vacancies` table, which is why deleting a job removes it from both.

---

## 3. Project structure

```text
JobLens/
├── docker-compose.yml          # db (Postgres) + api (FastAPI) containers
├── frontend/                   # Expo SDK 54 + React Native + TypeScript
│   ├── App.tsx                 # restoreSession() on boot, renders AppNavigator
│   ├── app.json                # expo.extra.apiUrl = phone-to-API address
│   └── src/
│       ├── api/
│       │   ├── client.ts       # apiRequest<T>(), API_URL, API_BASE_URL, adds Bearer token
│       │   ├── auth.ts         # login, register, me, updateProfile, uploadAvatar, getApplicantProfile
│       │   ├── vacancies.ts    # createVacancy, listVacancies, myVacancies, getVacancy, deleteVacancy
│       │   ├── applications.ts # applyToVacancy, myApplications, applicantsForVacancy,
│       │   │                   #   updateApplicationStatus, getMyHiredJobs
│       │   └── notifications.ts# getMyNotifications, markNotificationRead
│       ├── store/authStore.tsx # Zustand: user, login, logout, restoreSession, setUser
│       ├── navigation/         # AppNavigator, AuthStack, HireStack, WorkStack, types.ts
│       ├── constants/theme.ts  # COLORS, SPACING, RADIUS
│       └── screen/
│           ├── LoginPage.tsx, RegisterPage.tsx
│           ├── HireHomePage.tsx, HirePostEvent.tsx, HireJobapplicant.tsx,
│           │   HireProfile.tsx, WorkerProfileView.tsx
│           └── WorkHomePage.tsx, WorkApply.tsx, WorkNotifications.tsx, WorkProfile.tsx
└── backend/
    ├── Dockerfile, requirements.txt, .env (NOT committed), .env.example
    ├── uploads/avatars/        # uploaded profile photos (mounted volume, NOT committed)
    └── app/
        ├── main.py             # creates app, CORS, /uploads static mount, includes routers
        ├── database.py         # engine, Base, get_db
        ├── core/               # config.py, security.py (hash + JWT), deps.py (get_current_user, require_role)
        ├── models/             # user, vacancy, application, notification (SQLAlchemy)
        ├── schema/             # auth, vacancy, application, notification (Pydantic)
        └── routers/            # auth, vacancy, application, notification
```

Note the folder is called `schema` (singular) and router files are singular (`vacancy.py`, `application.py`). Python imports must match these names exactly (see the troubleshooting log).

---

## 4. Tech stack and why

| Piece          | Choice                                    | Why                                                                  |
| -------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| API            | FastAPI                                   | Fast to write, automatic Swagger docs at `/docs` for testing         |
| ORM            | SQLAlchemy 2 (sync `Session`) + `psycopg` | Simple relational mapping to Postgres                                |
| Validation     | Pydantic schemas                          | The contract between backend responses and frontend TypeScript types |
| Passwords      | `pwdlib` + Argon2                         | Modern password hashing; plain passwords are never stored            |
| Tokens         | `PyJWT` (HS256)                           | Stateless login; the token holds only `sub` = user id and `exp`      |
| Database       | PostgreSQL 16 in Docker                   | Real relational DB with foreign keys                                 |
| Mobile         | Expo SDK 54, React Native, TypeScript     | Runs in Expo Go on a phone                                           |
| State          | Zustand                                   | Tiny global store for the logged-in user                             |
| Navigation     | React Navigation native-stack             | Screens and typed route params                                       |
| Secure storage | `expo-secure-store`                       | Keeps the JWT encrypted on the device                                |
| Images         | `expo-image-picker`                       | Choose a profile photo from the gallery                              |

---

## 5. Backend in detail

### 5.1 Database tables

`Base.metadata.create_all()` runs at startup and creates any table that does not exist yet.

**users**
`id`, `email` (unique), `password_hash`, `full_name`, `role` (`hire` or `work`), `bio` (text), `skills` (text array), `avatar_url` (relative path such as `/uploads/avatars/abc.jpg`), `created_at`.

**vacancies**
`id`, `hirer_id` (FK to users), `title`, `category`, `description`, `location`, `price` (string such as `Rs 5000`), `status` (`open` or `closed`), `created_at`.

**applications**
`id`, `vacancy_id` (FK), `applicant_id` (FK), `status` (`applied`, `shortlisted`, `hired`, `rejected`), `applied_at`, `portfolio_link`, `message`, `confirmed_availability` (bool), `equipment` (text array).
Unique constraint on (`vacancy_id`, `applicant_id`) so a worker cannot apply twice to the same job.

**notifications**
`id`, `user_id` (FK), `message`, `is_read`, `created_at`.

### 5.2 IMPORTANT: adding columns to existing tables

`create_all()` only creates **missing tables**. It never adds columns to a table that already exists. When we added new columns, they had to be added by hand in `psql`:

```sql
-- profile fields on users
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN skills TEXT[];
ALTER TABLE users ADD COLUMN avatar_url VARCHAR;

-- extra application form fields
ALTER TABLE applications ADD COLUMN portfolio_link VARCHAR;
ALTER TABLE applications ADD COLUMN message TEXT;
ALTER TABLE applications ADD COLUMN confirmed_availability BOOLEAN DEFAULT FALSE;
ALTER TABLE applications ADD COLUMN equipment TEXT[];
```

If you rebuild on a fresh database these are created automatically. Long term, switch to Alembic migrations.

### 5.3 API routes

All routes are prefixed with `/api/v1`. "Who" is enforced by `require_role(...)` in `core/deps.py`.

**Auth**

| Method | Route             | Who       | Purpose                                       |
| ------ | ----------------- | --------- | --------------------------------------------- |
| POST   | `/auth/register`  | anyone    | Create a `hire` or `work` account             |
| POST   | `/auth/login`     | anyone    | Returns `access_token` and the user           |
| GET    | `/auth/me`        | logged in | Current user                                  |
| PATCH  | `/auth/me`        | logged in | Update name, bio, skills                      |
| POST   | `/auth/me/avatar` | logged in | Upload profile photo (jpg/png/webp, max 5 MB) |

**Vacancies**

| Method | Route             | Who          | Purpose                                          |
| ------ | ----------------- | ------------ | ------------------------------------------------ |
| POST   | `/vacancies`      | hire         | Create a job                                     |
| GET    | `/vacancies`      | anyone       | Public feed of open jobs (Work dashboard)        |
| GET    | `/vacancies/mine` | hire         | Own jobs with `applicant_count` (Hire dashboard) |
| GET    | `/vacancies/{id}` | anyone       | One job                                          |
| DELETE | `/vacancies/{id}` | hire (owner) | Delete a job and its applications                |

**Applications**

| Method | Route                          | Who          | Purpose                                                          |
| ------ | ------------------------------ | ------------ | ---------------------------------------------------------------- |
| POST   | `/applications`                | work         | Apply with portfolio link, message, availability, equipment      |
| GET    | `/applications/me`             | work         | Own applications                                                 |
| GET    | `/applications/me/hired`       | work         | Jobs I was hired for, with title/location/price                  |
| GET    | `/applications/vacancy/{id}`   | hire (owner) | Applicants for one job                                           |
| GET    | `/applications/applicant/{id}` | hire         | An applicant's profile, only if they applied to one of your jobs |
| PATCH  | `/applications/{id}/status`    | hire (owner) | Set `shortlisted` / `hired` / `rejected`                         |

There is also a leftover stub `GET /applications` that returns a placeholder message. It does nothing useful and can be deleted.

**Notifications**

| Method | Route                      | Who       | Purpose                        |
| ------ | -------------------------- | --------- | ------------------------------ |
| GET    | `/notifications`           | logged in | My notifications, newest first |
| PATCH  | `/notifications/{id}/read` | logged in | Mark one as read               |

### 5.4 Backend concepts worth remembering

- **Ownership checks.** Being a `hire` user is not enough. Every hire endpoint also checks `vacancy.hirer_id == current_user.id`, so one hirer cannot see or change another hirer's jobs.
- **Applicant privacy.** `GET /applications/applicant/{id}` returns 403 unless that person applied to one of _your_ jobs.
- **Hiring creates a notification.** Inside the status endpoint, when the new status is `hired`, a row is inserted into `notifications` for that worker.
- **Deleting a job.** The route deletes the job's applications first, then the vacancy. Without this, SQLAlchemy tried to set `applications.vacancy_id` to NULL and the database rejected it (NOT NULL violation, HTTP 500).
- **Avatar upload.** The file is saved to `uploads/avatars/<uuid>.<ext>`, the relative URL is stored in `users.avatar_url`, and `main.py` mounts `/uploads` as static files so the phone can load the image. The old file is deleted when a new one is uploaded.
- **The JWT `sub` must be a plain user id.** Call `create_access_token(user.id)`. Passing a dict like `{"sub": ...}` gets stringified and breaks every protected route.
- **Backend code is copied into the Docker image at build time.** After any backend edit you must run `docker compose up --build -d`.

---

## 6. Frontend in detail

### 6.1 Talking to the API

`src/api/client.ts` exports `apiRequest<T>(path, options)`. It prepends `API_URL`, sets `Content-Type: application/json`, reads the JWT from SecureStore and adds `Authorization: Bearer <token>`, then turns any error body's `detail` into a thrown `Error`.

- `API_URL` comes from `app.json` (`expo.extra.apiUrl`, ends with `/api/v1`).
- `API_BASE_URL` is the same address without `/api/v1`. It is used to build image URLs like `http://192.168.1.69:8000/uploads/avatars/x.jpg`.
- `uploadAvatar` in `auth.ts` calls `fetch` directly with `FormData`. It must **not** go through `apiRequest`, because forcing `Content-Type: application/json` would break multipart uploads.

### 6.2 Auth state

`authStore.tsx` (Zustand) holds `user`, `accessToken`, `isLoading` and the actions `login`, `logout`, `restoreSession`, `setUser`. `setUser` lets a screen update the user immediately, for example after a new avatar upload.

### 6.3 Navigation

`AppNavigator` shows `AuthStack`, `HireStack` or `WorkStack` depending on `user` and `user.role`.

| Stack     | Routes                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| AuthStack | `Login`, `Register`                                                                                                    |
| HireStack | `HireHome`, `HirePost`, `HireProfile`, `HireApplicants` (param `vacancyId`), `WorkerProfileView` (param `applicantId`) |
| WorkStack | `WorkHome`, `WorkApply` (param `vacancyId`), `WorkProfile`, `WorkNotifications`                                        |

Rules that caused bugs before:

1. Every screen must be **registered** as a `<Stack.Screen>` and its name and params must exist in `types.ts`.
2. Screens are wrapped by small `...Route` functions that turn `navigation.navigate(...)` into the plain callback props the screens expect (`onNavigateHome`, `onViewProfile`, ...).
3. `WorkHomePage` shows `WorkNotifications` using local state (`showNotifications`) rather than the stack, so the Notifications tab works even without navigation wiring.

### 6.4 Screens

| Screen                    | What it does                                                                              | API calls                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| LoginPage / RegisterPage  | Sign in / sign up                                                                         | `loginUser`, `registerUser`                                     |
| HireHomePage              | Stats, list of my jobs, trash icon to delete, tap card to open applicants                 | `myVacancies`, `deleteVacancy`                                  |
| HirePostEvent             | Form that becomes a vacancy (title built from type and city, price as `Rs <budget>`)      | `createVacancy`                                                 |
| HireJobapplicant          | Applicants for one job, search by name, "View Profile", "Select & Hire" with confirmation | `getVacancy`, `applicantsForVacancy`, `updateApplicationStatus` |
| WorkerProfileView         | Read-only worker profile for the hirer                                                    | `getApplicantProfile`                                           |
| HireProfile / WorkProfile | Own profile, tap avatar to pick a photo, logout                                           | `uploadAvatar`, `myVacancies` (hire only)                       |
| WorkHomePage              | Open jobs feed, "Apply Now" opens the form, unread notifications shown as alerts on load  | `listVacancies`, `getMyNotifications`, `markNotificationRead`   |
| WorkApply                 | Application form (portfolio link, message, availability, equipment)                       | `getVacancy`, `applyToVacancy`                                  |
| WorkNotifications         | List of jobs I was hired for; empty state if none                                         | `getMyHiredJobs`                                                |

The default avatar is a generated cartoon from DiceBear (seeded by email), so nobody sees a stranger's photo before uploading their own.

---

## 7. Running the project

### Prerequisites

- Docker Desktop running
- Node.js 20.19 or newer
- **Expo Go on your phone must be the SDK 54 build.** If Expo Go auto-updates to a newer SDK you will get "Project is incompatible with this version of Expo Go". Fix: uninstall Expo Go, install the SDK 54 APK from `https://expo.dev/go?sdkVersion=54&platform=android&device=true`, and turn off auto-update for Expo Go in the Play Store.
- Phone and computer on the same Wi-Fi

### Backend

```powershell
cd C:\Users\sophi\OneDrive\Desktop\JobLens
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8000/health
```

Swagger docs: `http://localhost:8000/docs`

`docker-compose.yml` should give the `api` service this volume so uploaded photos survive rebuilds:

```yaml
volumes:
  - ./backend/uploads:/app/uploads
```

Stop with `docker compose down`. Never use `docker compose down -v` unless you want to erase the database.

### Frontend

```powershell
cd C:\Users\sophi\OneDrive\Desktop\JobLens\frontend
npm install
npx expo install --fix
npx tsc --noEmit
npx expo start --clear
```

Scan the QR code with Expo Go. If a change does not show up, fully close Expo Go and rescan.

### Phone-to-API address

`localhost` on a phone means the phone itself. `frontend/app.json` therefore holds your computer's Wi-Fi address:

```json
"extra": { "apiUrl": "http://192.168.1.69:8000/api/v1" }
```

If your Wi-Fi IP changes (check `ipconfig`, Wi-Fi adapter, IPv4), update it. Quick test from the phone browser: `http://<your-ip>:8000/health` should show `{"status":"ok"}`.

---

## 8. Testing checklist

**In Swagger (`/docs`) first, then in the app:**

1. Register one `hire` and one `work` user. Log in, click **Authorize**, paste the token (no "Bearer").
2. As hire: `POST /vacancies`, then `GET /vacancies/mine`.
3. As work: `GET /vacancies` shows the job. `POST /applications` with `{"vacancy_id": 1, "confirmed_availability": true}`.
4. As hire: `GET /applications/vacancy/1` shows the applicant. `GET /vacancies/mine` shows `applicant_count: 1`.
5. As hire: `GET /applications/applicant/{worker_id}` returns the profile. For a worker who did _not_ apply you should get 403.
6. As hire: `PATCH /applications/{id}/status` with `{"status": "hired"}`. As work: `GET /notifications` and `GET /applications/me/hired` show it.
7. As hire: `DELETE /vacancies/1` returns 204. In `psql` both the vacancy and its applications are gone.
8. In the app, repeat the same flow with two accounts (or two devices).

Useful `psql` checks:

```powershell
docker exec -it joblens-db-1 psql -U joblens -d joblens
```

```sql
\pset pager off
\dt
SELECT id, email, role, avatar_url FROM users;
SELECT * FROM vacancies;
SELECT * FROM applications;
SELECT * FROM notifications;
```

---

## 9. Troubleshooting log (problems we hit and how they were fixed)

| Symptom                                                                        | Real cause                                                                                           | Fix                                                           |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `Property 'AppNavigator' doesn't exist`                                        | `App.tsx` used the component without importing it                                                    | Add the import                                                |
| Everything red in navigation files                                             | `zustand` and React Navigation were not installed, and `AuthStack/HireStack/WorkStack` did not exist | `npx expo install ...`, create the stack files                |
| `Property 'onRegister' is missing`                                             | Screens used callback props, React Navigation passes `navigation`                                    | Use `navigation.navigate("Register")`                         |
| `Type annotations can only be used in TypeScript files`                        | Screen was still `.jsx`                                                                              | Rename to `.tsx`                                              |
| `avatar_url / bio / skills` not on type                                        | Fields were added to `AuthResponse` instead of `User`                                                | Put them on `User` in `auth.ts`                               |
| **500 on every protected route** (`invalid literal for int(): "{'sub': '1'}"`) | `login` called `create_access_token({"sub": ...})`                                                   | Call `create_access_token(user.id)`                           |
| Two profile photos shown                                                       | Header and avatar block both rendered an `<Image>`                                                   | Keep one tappable avatar                                      |
| Upload failed / "Network request failed"                                       | API container had crashed (nothing listening on port 8000)                                           | `docker compose ps`, then `docker compose logs api --tail 50` |
| Apply gave "Method Not Allowed"                                                | `main.py` and the frontend imported the wrong module names (plural vs singular)                      | Make imports match the real filenames exactly                 |
| Container exits with `ModuleNotFoundError: app.routers.notification`           | File was accidentally named `notification,py` (comma)                                                | Rename to `notification.py`                                   |
| `No module named 'app.schema.user'`                                            | `UserOut` lives in `app.schema.auth`                                                                 | Fix the import                                                |
| `NAVIGATE ... was not handled by any navigator`                                | Screen defined but not registered as `<Stack.Screen>`                                                | Register it and add it to `types.ts`                          |
| `NativeStackScreenProps requires 1 to 3 type arguments`                        | A missing `<` in a generic type                                                                      | Add the `<`                                                   |
| Delete job returned 500 (`NotNullViolation` on `applications.vacancy_id`)      | ORM tried to null out child rows                                                                     | Delete applications first, then the vacancy                   |
| Warning: `MediaTypeOptions` deprecated                                         | Old expo-image-picker API                                                                            | Use `mediaTypes: ["images"]`                                  |
| "Project is incompatible with this version of Expo Go"                         | Phone's Expo Go updated to SDK 57, project is SDK 54                                                 | Install the SDK 54 Expo Go APK, disable auto-update           |

### Debug cheat sheet

```powershell
docker compose ps                                  # is the api container running?
docker compose logs api --tail 80                  # why did it crash?
docker compose up --build                          # run in foreground to watch startup errors
docker compose build --no-cache api                # rule out stale Docker cache
docker compose run --rm api ls -la app/routers/    # what files really exist inside the image?
dir backend\app\routers                            # check for typos in filenames (e.g. comma vs dot)
findstr /s /i "api/application" *.ts *.tsx         # find wrong frontend import paths (run in frontend\src)
npx tsc --noEmit                                   # TypeScript errors in your own code
```

Habits that would have saved time:

- After every backend change, rebuild the container and check `docker compose ps`.
- Test a new endpoint in Swagger before wiring the screen.
- If an edit "does nothing", suspect a typo in a filename or import path first.
- Paste whole files when debugging; small fragments hide duplicated or missing code.

---

## 10. Known issues and next steps

**Known issues**

- The trash icon on a job card sits inside a card that is itself tappable. The confirmation popup ("Delete this job? Cancel / Delete") is in the code, but if deleting ever happens without the popup, restructure so only the title area navigates and the trash button is a sibling.
- `WorkProfile.tsx` still uses the deprecated `ImagePicker.MediaTypeOptions.Images`. Change it to `["images"]` like `HireProfile.tsx`.
- `HireHomePage.tsx` "New Applicants" still shows three hardcoded demo people.
- `WorkHomePage.tsx` shows a hardcoded "Elite DP" status; `WorkProfile.tsx` shows a hardcoded "PREMIUM MEMBER" badge and a placeholder equipment card.
- Unread notifications appear as alert popups each time the Work home screen loads until they are dismissed.
- `HireHomePage.tsx` contains a duplicated `useEffect` (harmless, remove one).
- The leftover `GET /applications` stub route in `application.py` can be deleted.

**Next steps**

- Real "recent applicants across all my jobs" feed on the hire dashboard.
- Edit-profile screen (name, bio, skills) using `PATCH /auth/me`.
- Equipment and portfolio as real database tables.
- Unread-count badge on the Notifications tab; later, real push notifications.
- Refresh tokens and silent re-login.
- Alembic migrations instead of manual `ALTER TABLE`.
- Image and date fields on vacancies.
- Tests (pytest + httpx) and a deployed backend.

---

## 11. Before pushing to GitHub

- Do **not** commit `backend/.env` (JWT secret, database password) or `backend/uploads/`. Keep `backend/.env.example` as the template.
- Make sure `.gitignore` covers `node_modules/`, `.expo/`, `backend/.env`, `backend/uploads/`.
- Change `JWT_SECRET` and the CORS settings before any real deployment; the current values are for development.
- Run `npx tsc --noEmit` and confirm `docker compose ps` shows both containers up before you commit.
