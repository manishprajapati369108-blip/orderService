import "./config/dotenv.js"
import express from "express";
import jwt from "jsonwebtoken";
import sendEmail from "../../services/emailService.js";
import Participant from "../../models/Participant.js";
import generateRandom from "crypto-randomizer";
import upload from "../../middleware/multer.js"
import authMiddleware from "../../middleware/authMiddleware.js";
import bcrypt from "bcrypt"
import avatarUpload from "../../utils/avatarUpload.js";

//user authentication route
const router = express.Router()


router.post("/avatar", upload.single("avatar"), avatarUpload);

router.post("/register", async (req, res) => {
  try {
    const { avatar, name, email, password } = req.body;

    const existingUser = await Participant.findOne({ email });

    if (!email || !password || !name || !avatar) {
      return res.status(400).json({
        error: "All field are required",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        error: "Email already Exist",
      });
    }

    const user = new Participant({
      email: email,
      password: password,
      avatar,
      name,
    });

    await user.save();

    res.status(201).json({
      message: "registered successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Participant.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login Succcessful! You are logged In",
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Something is Wrong !!!");
    res.status(500).json({
      error: "Server error",
    });
  }
});

router.post("/logout", (req, res) => {
  console.log("LOGOUT ROUTE HIT");
  console.log("Cookies:", req.cookies);
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "LoggedOut successfully",
  });
});

//fetching my profile
router.get("/me", authMiddleware, async (req, res) => {
     try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
})

// forget Password routes
router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received forgot-password request");
    console.log("📧 Email:", email);
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ Find user
    const user = await ParticiParticipant.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    // ✅ Generate 6-digit OTP
    const otp = generateRandom(6, "number");

    // ✅ Save OTP with 15-minute expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    console.log("💾 OTP saved to database");

    // ✅ Create HTML content
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .otp { font-size: 36px; font-weight: bold; color: #2563eb; padding: 15px 25px; background: #f0f4ff; border-radius: 8px; display: inline-block; letter-spacing: 5px; }
                    .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔐 Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password for your File Drive account.</p>
                    <p>Use the OTP ${otp} to complete the process:</p>
                    <p class="warning">⏳ This OTP expires in <strong>15 minutes</strong>.</p>
                    <div class="footer">
                       
                    </div>
                </div>
            </body>
            </html>
        `;

    // ✅ Send email using BrevoClient
    console.log("📧 Attempting to send email...");
    await sendEmail(email, "🔐 Password Reset OTP", htmlContent);
    console.log("📧 Email sent successfully ✅");

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Error in forgot-password:", error.message);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// ===== 2. VERIFY OTP =====
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("📩 Received verify-otp request");
    const { email, otp } = req.body;
    console.log("📧 Email:", email, "🔢 OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await Participant.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired OTP");
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Generate temporary token
    const token = generateRandom(32, "alphaNumeric");
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log("✅ OTP verified, token generated");

    res.json({ tempToken: token });
  } catch (error) {
    console.error("❌ ERROR in verify-otp:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// ===== 3. RESET PASSWORD =====
router.post("/reset-password", async (req, res) => {
  try {
    console.log("📩 Received reset-password request");
    const { tempToken, newPassword } = req.body;

    if (!tempToken || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const user = await Participant.findOne({
      resetToken: tempToken,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired session");
      return res.status(400).json({ error: "Invalid or expired session" });
    }

    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    console.log("✅ Password reset successful");

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("❌ ERROR in reset-password:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// ===== 4. RESEND OTP =====

router.post("/resend-otp", async (req, res) => {
  try {
    console.log("📩 Received resend-otp request");
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Participant.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    // ✅ Generate new OTP
    const otp = generateRandom(6, "number");

    // ✅ Save new OTP with 15-minute expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    console.log("💾 New OTP saved to database");

    // ✅ Create HTML content for resend
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .otp { font-size: 36px; font-weight: bold; color: #2563eb; padding: 15px 25px; background: #f0f4ff; border-radius: 8px; display: inline-block; letter-spacing: 5px; }
                    .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                    .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔄 New OTP Generated</h2>
                    <p>Hello,</p>
                    <p>You requested a new OTP for password reset.</p>
                    <div class="highlight">
                        <p><strong>${otp}</strong></p>
                    </div>
                    <div class="footer">
                    </div>
                </div>
            </body>
            </html>
        `;

    // ✅ Send email using Brevo API (NOT transporter)
    console.log("📧 Attempting to send new OTP...");
    await sendEmail(email, "🔄 New Password Reset OTP", htmlContent);
    console.log("📧 New OTP sent successfully ✅");

    res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in resend-otp:", error.message);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

export default router;
