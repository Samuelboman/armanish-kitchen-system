import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { me } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup); //POST/api/auth/signup
router.post("/login", login); // POST/api/auth/login
router.get("/me", protect, me); // GET/api/auth/me

export default router;