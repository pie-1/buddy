// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js"; 
import roommateRoutes from "./routes/roommateRoutes.js"; 
import eventRoutes from "./routes/eventRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js";   
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes); 
app.use("/api/roommates", roommateRoutes); 
app.use("/api/events", eventRoutes);  
app.use("/api/chat", chatRoutes); 
app.use("/api/upload", uploadRoutes);                  

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success" });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});