import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["task", "habit"], 
      default: "task",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); 

export default mongoose.model("Item", itemSchema);
