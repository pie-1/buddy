import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  updateListingStatus,
  deleteListing,
} from "../controllers/listingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.patch("/:id/status", protect, updateListingStatus);
router.delete("/:id", protect, deleteListing);

export default router;