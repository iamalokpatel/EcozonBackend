// routes/orderRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  placeOrder,
  placeCartOrder,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/cart", protect, placeCartOrder);
router.get("/", protect, getUserOrders);

export default router;
