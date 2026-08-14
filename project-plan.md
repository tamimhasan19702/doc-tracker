# Doctor Tracker — Project Plan

**Architecture:** Separate Next.js frontend + standalone Express backend
**Database:** MongoDB (Mongoose)
**Auth:** JWT via Authorization Bearer header
**Charts:** Recharts

---

## 1. High-Level Architecture

```
┌─────────────────────┐        REST API (JSON)        ┌──────────────────────┐
│   Next.js Frontend   │ ─────────────────────────────▶│   Express Backend     │
│   (client app)       │◀───────────────────────────── │   (Node.js + Express) │
│   Port 3000           │        JWT in Authorization    │   Port 5000            │
└─────────────────────┘        Bearer header            └──────────┬────────────┘
                                                                     │
                                                                     ▼
                                                          ┌──────────────────┐
                                                          │     MongoDB       │
                                                          │  (Atlas/local)    │
                                                          └──────────────────┘
```

- Frontend never talks to MongoDB directly — everything goes through the Express REST API.
- Frontend stores the JWT (e.g., in memory + localStorage) after login and attaches it as `Authorization: Bearer <token>` on every protected request.
- Backend validates JWT via middleware on all protected routes.

---

## 2. Repository Structure

Two separate repos (or a monorepo with two top-level folders — your call, doesn't change the code).

### 2.1 Backend (`doctor-tracker-server`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                # Mongoose connection
│   │   └── env.js               # centralized env var loading/validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Patient.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── doctor.controller.js
│   │   ├── patient.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   ├── patient.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # verifies JWT, attaches req.user
│   │   ├── error.middleware.js  # centralized error handler
│   │   ├── validate.middleware.js # runs Joi/Zod schema validation
│   │   └── notFound.middleware.js
│   ├── validators/
│   │   ├── doctor.validator.js
│   │   └── patient.validator.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── paginate.js
│   ├── app.js                   # express app, middleware wiring
│   └── server.js                # entry point, starts HTTP server
├── .env.example
├── package.json
└── README.md
```

### 2.2 Frontend (`doctor-tracker-client`)

```
client/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx        # shared sidebar/topbar, auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── doctors/
│   │   │   │   ├── page.tsx           # list + search + filter + pagination
│   │   │   │   └── [id]/page.tsx      # doctor detail + patients
│   │   │   └── patients/
│   │   │       ├── page.tsx           # list + search + filter + pagination
│   │   │       └── [id]/page.tsx      # edit patient
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (generated via shadcn CLI + customized)
│   │   ├── doctors/
│   │   │   ├── DoctorTable.tsx
│   │   │   ├── DoctorFormModal.tsx
│   │   │   └── DoctorFilters.tsx
│   │   ├── patients/
│   │   │   ├── PatientTable.tsx
│   │   │   ├── PatientFormModal.tsx
│   │   │   └── PatientFilters.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── PatientsPerDoctorChart.tsx
│   │   │   └── DateTrendChart.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Topbar.tsx
│   ├── lib/
│   │   ├── utils.ts             # cn() helper (shadcn/ui)
│   │   ├── api-client.ts        # axios/fetch wrapper, attaches JWT
│   │   ├── auth.ts              # login/logout helpers, token storage
│   │   └── query-client.ts      # React Query setup
│   ├── hooks/
│   │   ├── useDoctors.ts
│   │   ├── usePatients.ts
│   │   └── useDashboardStats.ts
│   ├── store/
│   │   └── auth-store.ts        # zustand store for auth state
│   └── types/
│       ├── doctor.ts
│       └── patient.ts
├── .env.example
├── package.json
└── README.md
```

---

## 3. Database Schema (MongoDB / Mongoose)

### User
```js
{
  name: String,
  email: { type: String, unique: true, index: true },
  password: String, // bcrypt hashed
  role: { type: String, default: "admin" },
  createdAt, updatedAt
}
```

### Doctor
```js
{
  name: { type: String, required: true, index: true },
  specialization: { type: String, index: true },
  hospital: { type: String, index: true },
  phone: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: Date
}
```

### Patient
```js
{
  name: { type: String, required: true, index: true },
  age: Number,
  gender: String,
  condition: { type: String, index: true },   // for condition filter
  phone: String,
  doctor: { type: ObjectId, ref: "Doctor", required: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: Date
}
```

### Indexing strategy
- `Doctor.name`, `Doctor.specialization`, `Doctor.hospital` → text index for search: `db.doctors.createIndex({ name: "text", specialization: "text", hospital: "text" })`
- `Patient.name`, `Patient.condition` → text index similarly
- `Patient.doctor` → single-field index (heavily filtered/joined)
- `createdAt` on both collections → index for date-range filters and sort-by-recency
- Compound index example: `{ doctor: 1, createdAt: -1 }` on Patient, since "view patients for a doctor sorted by recency" is a common query

---

## 4. REST API Design

All protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | (optional, admin-seeded instead) |
| GET | `/api/auth/me` | Get current user |

### Doctors
| Method | Route | Description |
|---|---|---|
| GET | `/api/doctors?search=&specialization=&hospital=&from=&to=&page=&limit=` | List, search, filter, paginate |
| GET | `/api/doctors/:id` | Get one doctor |
| POST | `/api/doctors` | Create doctor |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/doctors/:id/patients` | Patients under this doctor |
| POST | `/api/doctors/:id/patients` | Add patient under this doctor |

### Patients
| Method | Route | Description |
|---|---|---|
| GET | `/api/patients?search=&condition=&from=&to=&page=&limit=` | List, search, filter, paginate |
| GET | `/api/patients/:id` | Get one patient |
| PUT | `/api/patients/:id` | Edit patient |
| DELETE | `/api/patients/:id` | Delete patient |

### Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Total doctors, total patients |
| GET | `/api/dashboard/patients-per-doctor` | Aggregated counts |
| GET | `/api/dashboard/trends?from=&to=` | Date-based stats (patients/doctors added per day/week/month) |

**Pagination convention:** every list endpoint returns
```json
{ "data": [...], "page": 1, "limit": 20, "total": 143, "totalPages": 8 }
```

**Query optimization notes:**
- Use `.lean()` on read-only Mongoose queries (skip hydration overhead).
- Use MongoDB aggregation pipelines for dashboard stats (`$group`, `$count`) instead of pulling all docs into Node and counting in JS.
- Use `$text` search with the text indexes above instead of regex scans where possible.
- Always paginate with `.skip().limit()` combined with an indexed sort field — avoid `skip()` on huge offsets in production (fine for this project's scale).

---

## 5. Authentication Flow

1. User submits email/password → `POST /api/auth/login`.
2. Backend verifies bcrypt hash, signs JWT (`jsonwebtoken`, short expiry e.g. 7d for simplicity).
3. Frontend stores token (localStorage) and user info in a Zustand `auth-store`.
4. `api-client.ts` (axios instance) attaches `Authorization: Bearer <token>` to every request automatically via an interceptor.
5. Next.js route group `(dashboard)/layout.tsx` checks auth state client-side; if no valid token, redirect to `/login`.
6. Express `auth.middleware.js` verifies JWT on every protected route; returns 401 if invalid/expired.
7. Logout = clear token from storage + Zustand state, redirect to `/login`.

*(Kept intentionally simple per your requirement — no refresh-token rotation, no httpOnly cookie complexity.)*

---

## 6. State Management & Data Fetching

- **Server state** (doctors, patients, dashboard stats): **React Query (TanStack Query)** — handles caching, background refetch, pagination state, loading/error states out of the box. Avoids manual `useEffect` fetch spaghetti and unnecessary re-renders.
- **Client/UI state** (auth token, sidebar open/close, modal open state): **Zustand** — minimal boilerplate, no context re-render issues.
- **Search/filter/pagination state**: kept in the URL query string (`useSearchParams`) so filters are shareable/bookmarkable and survive refresh; React Query keys derive from these params for automatic refetching.

---

## 7. Dashboard & Visualization (Recharts)

- **Stat cards**: Total Doctors, Total Patients, Avg Patients/Doctor, New Patients This Month.
- **Bar chart**: Patients per Doctor (top 10).
- **Line/Area chart**: Date-based trend — patients added over time (daily/weekly/monthly toggle).
- **Pie/Donut chart**: Patients by condition distribution.
- All chart data comes pre-aggregated from the backend (`/api/dashboard/*`) — never aggregate on the frontend.

---

## 8. UI/UX Plan

- Layout: fixed sidebar (Dashboard / Doctors / Patients) + topbar (user info, logout) + content area.
- Design system: **shadcn/ui** (Radix primitives + Tailwind CSS v4 + CVA). Components generated by the shadcn CLI into `components/ui/` and customized: Button, Input, Select, Dialog, Table, Pagination, Badge, Card, Tabs, Skeleton, DropdownMenu, Label, Sonner (toasts). Feature components (DoctorTable, PatientFormModal, StatCard, charts, etc.) are built on top of these primitives.
- Tables: sticky header, skeleton loading states, empty states, responsive → collapse to cards on mobile.
- Forms: modal-based create/edit for Doctor and Patient, client-side validation (Zod + react-hook-form) mirroring backend validation.
- Responsive breakpoints tested at mobile (375px), tablet (768px), desktop (1280px+).

---

## 9. Validation & Error Handling

- Backend: Zod or Joi schemas per route (`validate.middleware.js`), centralized `error.middleware.js` returning consistent shape:
  ```json
  { "success": false, "message": "...", "errors": [...] }
  ```
- Frontend: react-hook-form + zod resolver, mirrors backend rules to fail fast client-side; still handles backend validation errors gracefully (toast/inline messages).

---

## 10. Development Phases (Suggested Order)

| Phase | Scope |
|---|---|
| 1. Setup | Init both repos, MongoDB connection, env config, base Express app (CORS, JSON parsing, error middleware), base Next.js app with Tailwind, init shadcn/ui |
| 2. Auth | User model, login endpoint, JWT middleware, frontend login page + auth store + protected layout |
| 3. Doctor CRUD | Model, validators, controllers, routes; frontend list/search/filter/pagination + create/edit modal |
| 4. Patient CRUD | Same pattern, plus "patients under a doctor" nested routes and dedicated Patients page |
| 5. Dashboard | Aggregation endpoints, Recharts components, stat cards |
| 6. Polish | Responsive pass, loading/empty/error states, toasts, indexing pass on MongoDB, performance check (React Query devtools, avoid re-renders) |
| 7. Docs & Deploy | README (both repos), screenshots, deploy backend (Render/Railway) + frontend (Vercel), final env var check |

---

## 11. README Structure (per the required template)

Each repo gets its own README with:
1. **Description** — one-paragraph elevator pitch.
2. **Setup Guide** — clone, install, `.env.example` → `.env`, run dev server, seed script if any.
3. **System Architecture** — diagram + explanation of frontend↔backend↔DB data flow (reuse the diagram in section 1 above).
4. **Technical Decisions** — deep dive on 2 decisions, e.g.:
   - *Why separate Express backend instead of Next.js API routes* (explicit REST boundary, independent scaling/deployment, clearer separation of concerns for evaluation).
   - *Why React Query + Zustand instead of Redux* (server-state caching built-in, less boilerplate, avoids unnecessary global re-renders).
5. **Visual Evidence** — desktop + mobile screenshots of Dashboard, Doctors list, Patient modal, etc.

---

## 12. Deployment Suggestion

- **Backend**: Render or Railway (free tier fine), MongoDB Atlas for the database.
- **Frontend**: Vercel.
- Set `NEXT_PUBLIC_API_URL` in frontend env to the deployed backend URL; configure CORS on Express to allow the deployed frontend origin.

---

## 13. .env.example (draft)

**server/.env.example**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/doctor-tracker
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
```

**client/.env.example**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```