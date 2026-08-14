import { Router } from "express";
import {
  getSummary,
  getPatientsPerDoctor,
  getTrends,
  getConditions,
} from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/patients-per-doctor", getPatientsPerDoctor);
router.get("/trends", getTrends);
router.get("/conditions", getConditions);

export default router;
