# JobLens

JobLens is a TypeScript mobile app for Expo Go, with a Python FastAPI backend and PostgreSQL database. It currently supports creating an account, logging in with email and password, receiving a JWT access token, and calling a protected user endpoint.

## Project structure

```text
JobLens/
├── frontend/             # Expo SDK 54 + React Native + TypeScript app
│   ├── App.tsx           # Login/Register/Home screen switching
│   ├── app.json          # Expo settings and phone-to-API address
│   └── src/
│       ├── api/          # Typed FastAPI requests
│       └── screen/       # Login, registration, and signed-in UI
├── backend/              # FastAPI application
│   └── app/
│       ├── routers/      # Authentication API routes
│       ├── models.py     # PostgreSQL User model
│       └── security.py   # Password hashing and JWT tokens
└── docker-compose.yml    # PostgreSQL and FastAPI containers
```

## What is complete

### Frontend

- Expo Go compatibility is set to **Expo SDK 54**.
- The app uses **TypeScript** and React Native.
- The dark UI has working Login and Create Account screens.
- Forms validate missing fields and password length before requests are sent.
- Login and registration call the FastAPI backend.
- Successful login now routes users to role-based screens:
  - Hire users go to the hire dashboard, post-event screen, and hire profile.
  - Work users go to the work homepage, job application screen, and work profile.
- The hire dashboard includes a Post a Job action that opens the event creation flow.
- The work homepage now sends users to the application flow when they tap View Details.
- Profile screens include a logout confirmation popup with Cancel/Yes actions.
- The API address is stored in `frontend/app.json` under `expo.extra.apiUrl`.

### Backend

- FastAPI API with Swagger documentation.
- PostgreSQL database via Docker.
- `users` table with full name, email, password hash, role, and creation time.
- Passwords are hashed with Argon2; raw passwords are never stored.
- JWT authentication tokens are created on login.
- CORS is enabled for development.

### Current API routes

| Method | Route                   | Purpose                                  |
| ------ | ----------------------- | ---------------------------------------- |
| `GET`  | `/health`               | Confirm the API is running               |
| `POST` | `/api/v1/auth/register` | Create a `hire` or `work` account        |
| `POST` | `/api/v1/auth/login`    | Receive a JWT token and user data        |
| `GET`  | `/api/v1/auth/me`       | Get the current user with a Bearer token |

## What has already been run

The following setup was completed during development:

```powershell
# Checked the Docker Compose configuration
docker compose config

# Built and started the PostgreSQL and FastAPI containers
docker compose up --build -d

# Verified the containers
docker compose ps

# Verified the frontend code and navigation setup
npx tsc --noEmit
```

The API was tested successfully with this flow:

1. `GET /health` returned `{"status":"ok"}`.
2. A test user was registered.
3. That account logged in and received a JWT token.
4. `GET /api/v1/auth/me` returned the authenticated test user.

The containers were started successfully at that time. If you have restarted Docker or your computer since then, start them again using the command below.

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

Then scan the QR code with Expo Go.

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

## Current limitations / next work

- JWT is kept in memory only; it does not survive closing the app yet.
- Password reset, Google login, and Apple login buttons are visual only.
- The app now has core hire/work navigation and screen flows, but real backend persistence for job postings and applications is still pending.
- Database tables are created automatically at startup; production should use Alembic migrations.
- `JWT_SECRET` and CORS settings are development values. Change them before deployment.

## Useful files

- `frontend/package.json` — Expo SDK 54 dependencies
- `frontend/app.json` — application name and API address
- `frontend/src/api/auth.ts` — login and registration requests
- `backend/.env` — local API and database configuration
- `backend/app/main.py` — FastAPI entry point
- `docker-compose.yml` — containers to run locally
