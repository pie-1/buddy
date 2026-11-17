import express from "express";
import {
  getCurrentSpotlight, submitClaim, getMyClaims,
  getAdminClaims, verifyClaim, rejectClaim, adminPromote,
} from "../controllers/spotlightController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/current", getCurrentSpotlight);

// Student
router.post("/claim", protect, submitClaim);
router.get("/my-claims", protect, getMyClaims);

// Admin
router.get("/admin/claims", protect, adminOnly, getAdminClaims);
router.post("/admin/claims/:id/verify", protect, adminOnly, verifyClaim);
router.post("/admin/claims/:id/reject", protect, adminOnly, rejectClaim);
router.post("/admin/promote", protect, adminOnly, adminPromote);

export default router;