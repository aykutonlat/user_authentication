import express from "express";
import { authenicateUser } from "../middleware/auth.js";
import { registerUser } from "../controllers/userControllers.js";

export const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
