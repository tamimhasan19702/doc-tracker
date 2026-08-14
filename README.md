# Doctor Tracker

A doctor & patient management dashboard — manage doctors, patients, and analytics.

**Architecture:** Next.js frontend (`client/`) + Express backend (`server/`) + MongoDB (Mongoose). JWT auth, Recharts dashboard, shadcn/ui design system.

## Repos / Structure

- `client/` — Next.js 16 (App Router, Tailwind v4, shadcn/ui, React Query, Zustand)
- `server/` — Express REST API (Mongoose, JWT, Zod)
- `project-plan.md` — full project plan and API design

## Quick Start

> Full setup guides live in each folder's README.

1. Start MongoDB: `docker compose up -d`
2. Backend: `cd server && pnpm install && pnpm dev` (port 5000)
3. Frontend: `cd client && pnpm install && pnpm dev` (port 3000)
4. Seed data: `cd server && pnpm seed` (admin: `admin@doctor.app` / `admin123`)

Login at http://localhost:3000/login
