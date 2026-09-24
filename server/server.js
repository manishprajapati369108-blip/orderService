import "./config/dotenv.js"
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import ParticipantAuth from "./Routes/Owner/ParticipantAuth.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use("/auth", ParticipantAuth);

const startServer = async() => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startServer();