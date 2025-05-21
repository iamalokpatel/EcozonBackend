// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
