import mongoose from "mongoose";
import  dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
 try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected ${connect}`);
 } catch( error) {
    return new Error(error);
 }
}

export default connectDB;