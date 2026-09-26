import express from "express";
import { createOrder, getAllOrders, getOrderById,  assignRider, updateOrderStatus, } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);                          // POST /api/orders — anyone can place an order
router.get("/", protect, adminOnly, getAllOrders);       // GET  /api/orders — admin only
router.get("/:id", getOrderById);                        // GET  /api/orders/:id — public
router.put("/:id/assign-rider", protect, adminOnly, assignRider); // PUT  /api/orders/:id/assign-rider — admin only
router.put("/:id/status", protect, updateOrderStatus);   // PUT  /api/orders/:id/status — rider updates status on THEIR OWN assigned order
export default router;
