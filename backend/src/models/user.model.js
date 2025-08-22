// backend/src/models/user.model.js
import mongoose from "mongoose";

// Mongoose schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

export default mongoose.model("User", userSchema);
