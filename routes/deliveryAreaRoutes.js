import express from "express";
import { getActiveAreas, getAllAreas, createArea, updateArea, deleteArea } from "../controllers/deliveryAreaController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getActiveAreas);
router.get("/all", protect, adminOnly, getAllAreas);
router.post("/", protect, adminOnly, createArea);
router.put("/:id", protect, adminOnly, updateArea);
router.delete("/:id", protect, adminOnly, deleteArea);

export default router;