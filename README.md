# Doctor Tracker

A doctor and patient management dashboard. It allows adding, editing and deleting doctors and patients, searching and filtering the lists, and reviewing analytics through charts.

## Live demo

- **Frontend:** https://doc-tracker-kappa.vercel.app/
- **Backend API:** https://doc-tracker-5dw7.onrender.com

**Demo login:** `admin@doctor.app` / `admin123`

## Components

The project is split into two applications that communicate over a REST API:

- **App** — the frontend UI, built with Next.js and served on port 3000 (`client/`)
- **Server** — the Express REST API and data layer, served on port 5000 (`server/`)

## How it works (architecture)

The frontend and backend are fully separated:

- The browser never talks to MongoDB directly. All data access goes through the Express server, which is the only component allowed to read and write the database.
- Every request to a protected endpoint must include a JWT in the `Authorization` header. The server verifies the token before serving any data.
- The frontend stores the JWT in localStorage after login and attaches it automatically to every request via an axios interceptor.
- The backend uses Mongoose models with defined schemas, Zod validators on request bodies, and a centralized error handler that returns a consistent error shape.
- Dashboard stats (totals, per-doctor counts, trends, condition distribution) are pre-aggregated in MongoDB using aggregation pipelines — no client-side computation.

This separation allows the frontend and server to run and be deployed independently, and keeps a single, central place where access is authorized.

## Security

- Login uses email + password; passwords are stored as bcrypt hashes, never plain text.
- On successful login the server signs a JWT (7-day expiry) which the app sends as `Authorization: Bearer <token>`.
- Unauthenticated requests receive a 401 and the app clears the session and redirects to the login page.

## How to run it

Requires [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com) (or Docker).

1. Start MongoDB
2. Start the server: `cd server`, then `pnpm install` and `pnpm dev`
3. Start the app: `cd client`, then `pnpm install` and `pnpm dev`
4. Open http://localhost:3000/login and sign in

**Demo login:** `admin@doctor.app` / `admin123`

To fill the app with sample data, run `pnpm seed` inside the `server` folder (creates an admin user, 10 doctors and 30 patients).

## Features

- Secure JWT login
- Doctor CRUD: list, search, filter by specialization/hospital, pagination
- Patient CRUD: list, search, filter by condition, assign to a doctor, pagination
- Doctor detail page with its assigned patients
- Dashboard: stat cards, patients-per-doctor bar chart, condition donut chart, and a patient trend area chart with daily/weekly/monthly toggles

## Tech

- **Frontend:** Next.js, shadcn/ui, Zustand, Recharts, react-hook-form + Zod
- **Backend:** Express, MongoDB (Mongoose), Zod, JWT
- **API:** REST, paginated list endpoints returning `{ success, data, page, limit, total, totalPages }`
