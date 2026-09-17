import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
 try {
    const mongodb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`mongodb connected : ${mongodb}`)
 } catch {
    console.log(error);
    console.log("Database connection failed");
 }
}

export default connectDB;
