// backend/src/models/item.model.js
import mongoose from "mongoose";

// Mongoose schema for the Item model (Tasks/Habits)
const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      // Corrected field name
      type: Date,
    },
    type: {
      type: String,
      enum: ["task", "habit"], // Can only be 'task' or 'habit'
      default: "task",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

export default mongoose.model("Item", itemSchema);
