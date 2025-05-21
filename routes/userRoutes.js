import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Sample route for user registration
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/profile", protect, getUserProfile);

export default router;
