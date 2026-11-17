import express from "express";
import {
  createHelpPost, getHelpPosts, getHelpPostById,
  replyToHelpPost, toggleHelpPostStatus, deleteHelpPost,
} from "../controllers/helpController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHelpPosts);
router.post("/", protect, createHelpPost);
router.get("/:id", protect, getHelpPostById);
router.post("/:id/reply", protect, replyToHelpPost);
router.put("/:id/toggle-status", protect, toggleHelpPostStatus);
router.delete("/:id", protect, deleteHelpPost);

export default router;