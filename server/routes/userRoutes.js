import express from "express";
import {
  getMyProfile, getProfileById, updateMyProfile, getDirectory,
  likeUser, unlikeUser, requestCollegeDomain,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDirectory);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:id", protect, getProfileById);
router.post("/:id/like", protect, likeUser);
router.delete("/:id/like", protect, unlikeUser);
router.post("/college-requests", requestCollegeDomain);

export default router;