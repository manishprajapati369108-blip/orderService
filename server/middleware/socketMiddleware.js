import { parseCookie } from "cookie-es";
import jwt from "jsonwebtoken";
import Participant from "../models/Participant.js";
import dotenv from "dotenv";

dotenv.config();

const socketMiddleware = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;

    if (!rawCookies) {
      return next(new Error("No cookie received"));
    }

    const ripedCookies = parseCookie(rawCookies);

    const token = ripedCookies.token;

    if (!token) {
      return next(new Error("No token Found"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Participant.findById(decode.userId).select("-password");

    if (!user) {
      return next(new Error("User not found??"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    socket.currentConversation = null; // Track current conversation
    next();
  } catch (error) {
    console.error("Socket Error:", error);
    next(new Error("Authentication failed"));
  }
};

export default socketMiddleware;
