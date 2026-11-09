// server/routes/uploadRoutes.js
import express from "express";
import { upload } from "../config/cloudinary.js";
import { uploadImages } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/images", protect, upload.array("images", 4), uploadImages);

export default router;