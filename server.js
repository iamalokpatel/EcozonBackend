import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
