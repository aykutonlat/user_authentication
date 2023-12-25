import express from "express";
import { changeActivated, getUsers } from "../controllers/adminControllers.js";

export const adminRoutes = express.Router();

adminRoutes.get("/get-users", getUsers);
adminRoutes.post("/change-activated/:userId", changeActivated);
