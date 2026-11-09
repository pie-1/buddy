// server/routes/chatRoutes.js
import express from "express";
import {
  startConversation,
  getMyConversations,
  getConversationById,
  sendMessage,
  archiveConversation,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startConversation);
router.get("/", protect, getMyConversations);
router.get("/:id", protect, getConversationById);
router.post("/:id/messages", protect, sendMessage);
router.put("/:id/archive", protect, archiveConversation);

export default router;