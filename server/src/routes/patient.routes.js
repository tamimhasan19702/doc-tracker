import { Router } from "express";
import {
  listPatients,
  getPatient,
  updatePatient,
  removePatient,
} from "../controllers/patient.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updatePatientSchema } from "../validators/patient.validator.js";

const router = Router();

// All patient routes require a valid JWT.
router.use(protect);

router.route("/").get(listPatients);

router
  .route("/:id")
  .get(getPatient)
  .put(validate(updatePatientSchema), updatePatient)
  .delete(removePatient);

export default router;
