import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getAllMenuItems);   // GET  /api/menu
router.get("/:id", getMenuItemById);   //GET   /api/menu/:id
router.post("/", createMenuItem);   //POST  /api/menu
router.put("/:id", updateMenuItem);    //PUT   /api/menu/:id
router.delete("/:id", deleteMenuItem);  // DELETE /api/menu/:id

export default router;
