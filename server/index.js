import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import morgan from "morgan";
import { Server as SocketIoServer } from "socket.io";
import http from "http";
import { authenicateAdmin, authenicateSuperAdmin } from "./middleware/auth.js";
import { userRoutes } from "./routes/userRoutes.js";
import "./helpers/cronJobsHelper.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { superAdminRoutes } from "./routes/superAdminRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/user", userRoutes);
app.use("/superadmin", authenicateSuperAdmin);
app.use("/superadmin/dashboard", superAdminRoutes);
app.use("/admin", authenicateAdmin);
app.use("/admin/dashboard", adminRoutes);

const server = http.createServer(app);
const io = new SocketIoServer(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
