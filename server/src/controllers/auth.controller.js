import * as authService from "../services/auth.service.js";
import { cookieOptions, clearCookieOptions } from "../utils/cookieOptions.js";
import * as forgotPasswordService from "../services/forgotPassword.service.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.registerUser({ email, password });

    res.status(201).json({
      message: "Registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.loginUser({ email, password });

    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Login successful! You are logged in",
      email: user.email,
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Server error",
    });
  }
};

export const logout = (req, res) => {
  console.log("LOGOUT ROUTE HIT");
  console.log("Cookies:", req.cookies);

  res.clearCookie("token", clearCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received forgot-password request");
    console.log("📧 Email:", email);

    const result = await forgotPasswordService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error("❌ Error in forgot-password:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Something went wrong",
      ...(error.statusCode ? {} : { details: error.message }),
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    console.log("📩 Received verify-otp request");
    const { email, otp } = req.body;
    console.log("📧 Email:", email, "🔢 OTP:", otp);

    const result = await forgotPasswordService.verifyOtp(email, otp);
    res.json(result);
  } catch (error) {
    console.error("❌ ERROR in verify-otp:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Something went wrong",
      ...(error.statusCode ? {} : { details: error.message }),
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log("📩 Received reset-password request");
    const { tempToken, newPassword } = req.body;

    const result = await forgotPasswordService.resetPassword(tempToken, newPassword);
    res.json(result);
  } catch (error) {
    console.error("❌ ERROR in reset-password:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Something went wrong",
      ...(error.statusCode ? {} : { details: error.message }),
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    console.log("📩 Received resend-otp request");
    const { email } = req.body;

    const result = await forgotPasswordService.resendOtp(email);
    res.json(result);
  } catch (error) {
    console.error("❌ Error in resend-otp:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Something went wrong",
      ...(error.statusCode ? {} : { details: error.message }),
    });
  }
};