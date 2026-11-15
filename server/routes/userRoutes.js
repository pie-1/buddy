// server/routes/userRoutes.js
import express from "express";
import {
  getMyProfile, getProfileById, updateMyProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:id", protect, getProfileById);

export default router;