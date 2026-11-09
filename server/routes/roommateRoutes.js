// server/routes/roommateRoutes.js
import express from "express";
import {
  createRoommate,
  getAllRoommates,
  getRoommateById,
  updateRoommate,
  deleteRoommate,
} from "../controllers/roommateController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRoommates);
router.get("/:id", getRoommateById);
router.post("/", protect, createRoommate);
router.put("/:id", protect, updateRoommate);
router.delete("/:id", protect, deleteRoommate);

export default router;