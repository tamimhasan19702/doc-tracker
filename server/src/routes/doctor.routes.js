import { Router } from "express";
import {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  removeDoctor,
  listDoctorPatients,
  addDoctorPatient,
} from "../controllers/doctor.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../validators/doctor.validator.js";
import { createPatientSchema } from "../validators/patient.validator.js";

const router = Router();

// All doctor routes require a valid JWT.
router.use(protect);

router
  .route("/")
  .get(listDoctors)
  .post(validate(createDoctorSchema), createDoctor);

router
  .route("/:id")
  .get(getDoctor)
  .put(validate(updateDoctorSchema), updateDoctor)
  .delete(removeDoctor);

// Nested patients under a doctor.
router
  .route("/:id/patients")
  .get(listDoctorPatients)
  .post(validate(createPatientSchema), addDoctorPatient);

export default router;
