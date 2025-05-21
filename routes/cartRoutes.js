import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/remove/:productId", protect, removeFromCart);

export default router;
