// server/routes/userRoutes.js
import express from "express";
import {
  getMyProfile, getProfileById, updateMyProfile, getDirectory,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { requestCollegeDomain } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getDirectory);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:id", protect, getProfileById);
router.post("/college-requests", requestCollegeDomain); 


export default router;