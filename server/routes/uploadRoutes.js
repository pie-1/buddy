import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { upload } from "../config/cloudinary.js";
import { validateUploads } from "../middlewares/validateUploads.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/images",
  protect,
  upload.array("images", 4),
  validateUploads,
  uploadImages
);

export default router;