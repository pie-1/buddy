// server/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import { upload, MAX_FILE_MB, MAX_FILES } from "../config/cloudinary.js";
import { validateUploads } from "../middlewares/validateUploads.js";
import { uploadImages } from "../controllers/uploadController.js";

const router = express.Router();

const parseFiles = (req, res, next) => {
  upload.array("images", MAX_FILES)(req, res, (err) => {
    if (!err) return next();

    console.error("MULTER ERROR:", err.code || err.name, err.message);

    if (err instanceof multer.MulterError) {
      const map = {
        LIMIT_FILE_SIZE: [413, `Each file must be under ${MAX_FILE_MB}MB`],
        LIMIT_FILE_COUNT: [400, `You can upload up to ${MAX_FILES} files`],
        LIMIT_UNEXPECTED_FILE: [400, `You can upload up to ${MAX_FILES} files`],
      };
      const [status, message] = map[err.code] || [400, err.message];
      return res.status(status).json({ message });
    }
    if (err.code === "INVALID_FILE_TYPE") return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: "Upload failed", detail: err.message });
  });
};

router.post("/images", protect, parseFiles, validateUploads, uploadImages);

export default router;