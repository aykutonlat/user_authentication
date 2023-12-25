import express from "express";
import {
  changeActivated,
  changeRole,
  deleteUser,
  getUsers,
} from "../controllers/superAdminControllers.js";

export const superAdminRoutes = express.Router();

superAdminRoutes.get("/get-users", getUsers);
superAdminRoutes.post("/change-activated/:userId", changeActivated);
superAdminRoutes.post("/change-role/:userId", changeRole);
superAdminRoutes.post("/delete-user/:userId", deleteUser);
