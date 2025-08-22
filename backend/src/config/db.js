// backend/src/config/db.js
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Use the MONGO_URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;