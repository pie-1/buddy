import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// We pass a middleware that tries to decode the token but doesn't fail if missing
// If your `protect` middleware fails on missing tokens, you'll need to create a new one or adjust it.
// Assuming `protect` allows a `optional` flag:
router.get("/", (req, res, next) => {
  // If the header exists, try to authenticate, otherwise continue as guest
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getAllListings);

router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

export default router;