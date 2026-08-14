import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

/** Public: exchange credentials for a JWT. */
router.post("/login", validate(loginSchema), login);
/** Protected: current user's profile. */
router.get("/me", protect, me);

export default router;
