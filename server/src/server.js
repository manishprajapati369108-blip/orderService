import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  }),
);

const start = async () => {
    try {
  await connectDB();
  server.listen(process.env.PORT, () => {
    console.log(`server is listening on ${process.env.PORT}`)
  })
 } catch (error) {
  console.error("Database Connection failed:" ,error)
 }
}

start();
