// server/controllers/uploadController.js
import { uploadToCloudinary } from "../config/cloudinary.js";

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = await Promise.all(req.files.map(uploadToCloudinary));

    // Return richer shape: { url, thumb, isPdf }[]
    res.status(200).json({
      urls: results.map((r) => r.url),
      files: results,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error?.code || error?.http_code || "", error?.message || error);
    if (error?.code === "CLOUDINARY_NOT_CONFIGURED") {
      return res.status(500).json({ message: "Image storage is not configured on the server" });
    }
    const status = error?.http_code && error.http_code < 500 ? 502 : 500;
    res.status(status).json({
      message: "Could not store the files. Please try again.",
      detail: error?.message,
    });
  }
};