import express from "express";
import { authenicateUser } from "../middleware/auth.js";
import {
  changePassword,
  forgotPassword,
  loginUser,
  refreshToken,
  registerUser,
  resendVerifiedMail,
  resetPassword,
  verifiedMail,
} from "../controllers/userControllers.js";

export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verification-email/:token", verifiedMail);
userRoutes.post("/resend-verification-email/:token?", resendVerifiedMail);
userRoutes.post("/login", loginUser);
userRoutes.get("/refresh-token", refreshToken);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/change-password/:token", changePassword);
