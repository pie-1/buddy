// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import roommateRoutes from "./routes/roommateRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import teamRequestRoutes from "./routes/teamRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initSocket } from "./sockets/chatSocket.js";
import helpRoutes from "./routes/helpRoutes.js";
import spotlightRoutes from "./routes/spotlightRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/roommates", roommateRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api", teamRequestRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/spotlight", spotlightRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => res.json({ status: "success" }));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
initSocket(httpServer);
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));