# Doctor Tracker

A simple app to manage doctors and patients in a clinic. Add doctors, add patients, and see charts showing how many patients each doctor has, patient conditions, and trends over time.

## What's inside

The project has two parts that work together:

- **App** — the screens you see in your browser (`client/`)
- **Server** — keeps all the data safe in a database (`server/`)

## How it works (architecture)

```
  You (browser)
       │
       ▼
  App (Next.js, port 3000)   ← the screens you see
       │  sends requests over the internet (REST API)
       ▼
  Server (Express, port 5000)  ← the brain: checks who you are,
       │                          saves/finds/updates data
       ▼
  MongoDB                       ← the filing cabinet where all
                                  data actually lives
```

**Plain-language version:** the app is like a front desk. When you click "Add patient" in your browser, the app doesn't save anything itself — it hands the request to the server, the server checks that you're logged in, files the record in the database, and sends a confirmation back to the app. The same flow works backwards: to show a list, the app asks the server to fetch records from the database.

This separation means:

- Your browser never touches the database directly — the server is the only thing allowed to.
- The app and server can run (and be upgraded) independently of each other.
- The server is the single place that decides who can do what.

## Security

- You must log in with an email and password; the password is stored as an unreadable hash, not plain text.
- The server gives you a secret "key" (a JWT token) after login, and the app sends it with every request. Without a valid key, the server refuses to do anything.
- Logging out simply throws that key away.

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
- Trend chart switches between daily, weekly and monthly views

## Tech

- **App:** Next.js, shadcn/ui
- **Server:** Express, MongoDB (Mongoose)
- **Auth:** JWT
- **Charts:** Recharts
- **State:** Zustand
