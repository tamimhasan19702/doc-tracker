# Doctor Tracker — Server

Express REST API for Doctor Tracker. Manages doctors, patients, dashboard stats, and JWT authentication against MongoDB (Mongoose).

## Setup

1. `pnpm install`
2. Copy `.env.example` → `.env` and set values.
3. Start MongoDB (see repo root `docker-compose.yml`).
4. `pnpm dev` — runs on http://localhost:5000

## Scripts

| Command       | Description                     |
| ------------- | ------------------------------- |
| `pnpm dev`    | Run with nodemon (hot reload)   |
| `pnpm start`  | Run without watch               |
| `pnpm seed`   | Seed admin user + sample data   |

Seed credentials: `admin@doctor.app` / `admin123`

## API

All routes except `/api/auth/login` and `/api/health` require `Authorization: Bearer <token>`.

- `POST /api/auth/login` — login, returns JWT
- `GET  /api/auth/me` — current user
- `GET  /api/doctors?search&specialization&hospital&from&to&page&limit` — list doctors
- `GET|PUT|DELETE /api/doctors/:id` — get/update/delete doctor (delete blocked if patients exist)
- `GET|POST /api/doctors/:id/patients` — patients under a doctor / add patient
- `GET  /api/patients?search&condition&doctor&from&to&page&limit` — list patients
- `GET|PUT|DELETE /api/patients/:id` — get/update/delete patient
- `GET  /api/dashboard/summary` — totals + new this month + avg per doctor
- `GET  /api/dashboard/patients-per-doctor` — top 10 doctors by patient count
- `GET  /api/dashboard/trends?from&to&period=daily|weekly|monthly` — date trends
- `GET  /api/dashboard/conditions` — patient counts by condition

List endpoints return `{ success, data, page, limit, total, totalPages }`.
