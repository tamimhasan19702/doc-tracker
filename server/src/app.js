import express from "express";
import cors from "cors";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());

/** Health check for smoke tests and uptime monitors. */
app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// API route groups.
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Fallbacks: 404, then centralized error handling.
app.use(notFound);
app.use(errorHandler);

export default app;
