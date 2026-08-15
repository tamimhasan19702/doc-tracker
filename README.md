# Doctor Tracker

A simple app to manage doctors and patients in a clinic. Add doctors, add patients, and see charts showing how many patients each doctor has, patient conditions, and trends over time.

## What's inside

The project has two parts:

- **App** — the screens you see in your browser (`client/`)
- **Server** — keeps all the data in a database (`server/`)

## How to run it

You need [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com) (or Docker) installed.

1. Start MongoDB
2. Start the server: `cd server`, then `pnpm install` and `pnpm dev`
3. Start the app: `cd client`, then `pnpm install` and `pnpm dev`
4. Open http://localhost:3000/login and sign in

**Demo login:** `admin@doctor.app` / `admin123`

To fill the app with sample data, run `pnpm seed` inside the `server` folder.

## Features

- Secure login
- Add, edit and delete doctors and patients
- Search and filter the lists
- Dashboard with charts (patients per doctor, conditions, trends over time)

## Tech

- Next.js frontend + Express backend + MongoDB
- Charts with Recharts, UI with shadcn/ui
