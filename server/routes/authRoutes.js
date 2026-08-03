import express from "express";
import { register, login, getCurrentUser, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, validate(updateProfileSchema), updateProfile);

export default router;