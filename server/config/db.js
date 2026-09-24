import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;              // ✅ let the caller know
  }
};

export default connectDB;