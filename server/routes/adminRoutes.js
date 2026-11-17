import express from "express";
import {
  getCollegeRequests,
  updateCollegeRequest,
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/college-requests", getCollegeRequests);
router.put("/college-requests/:id", updateCollegeRequest);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;