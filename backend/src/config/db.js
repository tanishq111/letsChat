import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env so process.env.MONGO_URI is available

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // can't run without a database — stop the server
  }
};
