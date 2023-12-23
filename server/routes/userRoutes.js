import express from "express";
import { authenicateUser } from "../middleware/auth.js";
import {
  registerUser,
  resendVerifiedMail,
  verifiedMail,
} from "../controllers/userControllers.js";

export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verification-email/:token", verifiedMail);
userRoutes.post("/resend-verification-email/:token?", resendVerifiedMail);
