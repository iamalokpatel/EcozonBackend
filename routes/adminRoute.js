import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { getAllOrders, getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/users", protect, isAdmin, getAllUsers);

export default router;
