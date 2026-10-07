import "./config/dotenv.js";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authMiddleware from "./middleware/authMiddleware.js";
import ParticipantAuth from "./Routes/Owner/ParticipantAuth.js";
import Restaurant from "./Routes/Owner/Restaurant.js";
import Fetch from "./Routes/Owner/Fetch.js";
import socketRoutes from "./Routes/Socket/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/auth", ParticipantAuth);
app.use("/restaurant", authMiddleware, Restaurant);
app.use("/fetch", authMiddleware, Fetch);


//Http server for real time communication

const server = http.createServer(app);

const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socketRoutes(io, socket);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    })

})

const startServer = async () => {
  try {
    await connectDB();
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
