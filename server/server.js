import "./config/dotenv.js"
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:6000",
    credentials: true,
}))

const startServer = async() => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();