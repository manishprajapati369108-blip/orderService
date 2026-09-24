import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Participant from "../models/Participant.js";
dotenv.config();
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        error: "No token found",
      });
    }

    //here decode has only userId we get from jwt in login but we need complete information so we use variable user  which find all information using userId
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Participant.findById(decode.userId).select("-password");

    //here user is the database instance; we assigned with req.user
    req.user = user;
    req.user._id = user._id.toString()

    next();
  } catch (error) {
    console.log("problem in Middleware");
    res.status(401).json({
      success: false,
      error: error,
    });
  }
};

export default authMiddleware;
