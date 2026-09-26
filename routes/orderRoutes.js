import express from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);                          // POST /api/orders — anyone can place an order
router.get("/", protect, adminOnly, getAllOrders);       // GET  /api/orders — admin only
router.get("/:id", getOrderById);                        // GET  /api/orders/:id — public

export default router;
