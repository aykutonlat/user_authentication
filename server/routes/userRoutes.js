import express from "express";
import {
  changeEmail,
  changePassword,
  changeUsername,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  profileUpdate,
  refreshToken,
  registerUser,
  requestEmailChange,
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
userRoutes.get("/profile-update/:token", profileUpdate);
userRoutes.post("/request-change-email/:token", requestEmailChange);
userRoutes.post("/change-email/:token", changeEmail);
userRoutes.post("/change-username/:token", changeUsername);
userRoutes.get("/get-user/:token", getUser);
userRoutes.get("/logout/:token", logoutUser);
