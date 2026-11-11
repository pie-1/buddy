// server/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";
import crypto from "crypto";

export const MAX_FILE_MB = 5;
export const MAX_FILES = 4;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    const err = new Error("Only JPG, PNG, WEBP images and PDF files are allowed");
    err.code = "INVALID_FILE_TYPE";
    cb(err);
  },
});

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const err = new Error("Cloudinary env vars are missing");
    err.code = "CLOUDINARY_NOT_CONFIGURED";
    throw err;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function uploadToCloudinary(file) {
  ensureConfigured();
  const isPdf = file.mimetype === "application/pdf";
  const id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "collegebuddy/listings",
        resource_type: "image", // PDFs as images so Cloudinary generates a thumbnail
        public_id: isPdf ? `${id}.pdf` : id,
      },
      (err, result) => {
        if (err) return reject(err);
        // For PDFs, build the page-1 thumbnail URL so the frontend can show a preview
        if (isPdf) {
          const thumb = cloudinary.url(result.public_id, {
            resource_type: "image",
            format: "jpg",
            page: 1,
            width: 600,
            crop: "limit",
          });
          return resolve({ url: result.secure_url, thumb, isPdf: true });
        }
        resolve({ url: result.secure_url, thumb: result.secure_url, isPdf: false });
      }
    );
    Readable.from(file.buffer).pipe(stream);
  });
}