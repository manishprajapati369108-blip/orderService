import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./router/authRoutes.js";
import forgetPassword from "./router/forgetPassword.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import fileStorage from "./router/fileStorage.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(
  cors({
    origin: "https://file-drive-ten.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/otp", forgetPassword);
app.use("/file", fileStorage);

app.get("/", (req, res) => {
  res.json({
    message: "File Drive API is running!",
    status: "✅ Online",
    endpoints: {
      auth: "/auth",
      files: "/file",
      otp: "/otp",
    },
  });
});

// server/server.js (add this before app.listen)

// ✅ Test email route

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
  } catch (error) {
    console.log("something went wrong");
    console.log(error.message);
  }
};

start();
