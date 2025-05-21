import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  featureProducts,
  CategorisedProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", featureProducts);
router.get("/categories", CategorisedProduct);
router.post("/add", upload.single("image"), protect, isAdmin, createProduct);
router.get("/:id", getProductById);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.put("/:id", upload.single("image"), protect, isAdmin, updateProduct);

export default router;
