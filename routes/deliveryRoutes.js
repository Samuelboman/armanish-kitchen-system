import express from "express";
import { getQuote, getSettings, updateSettings } from "../controllers/deliveryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/quote", getQuote);
router.get("/settings", protect, adminOnly, getSettings);
router.put("/settings", protect, adminOnly, updateSettings);

export default router;