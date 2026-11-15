// server/routes/teamRequestRoutes.js
import express from "express";
import {
  createTeamRequest, getTeamRequestsForEvent, getTeamRequestById,
  updateTeamRequest, deleteTeamRequest, applyToTeam, decideApplicant,
} from "../controllers/teamRequestController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Nested under events for creation and listing
router.post("/events/:eventId/team-requests", protect, createTeamRequest);
router.get("/events/:eventId/team-requests", getTeamRequestsForEvent);

// Direct team-request routes
router.get("/team-requests/:id", getTeamRequestById);
router.put("/team-requests/:id", protect, updateTeamRequest);
router.delete("/team-requests/:id", protect, deleteTeamRequest);
router.post("/team-requests/:id/apply", protect, applyToTeam);
router.put("/team-requests/:id/applicants/:userId", protect, decideApplicant);

export default router;