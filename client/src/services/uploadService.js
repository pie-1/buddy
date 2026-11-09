// client/src/services/uploadService.js
import api from "./api";
import { squish } from "squish-image";

export const uploadImages = async (files) => {
  const formData = new FormData();

  // Compress each image in the browser before sending to Cloudinary
  for (const file of files) {
    const { blob } = await squish(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      format: "image/webp", // WebP is ~30% smaller than JPEG at same quality
    });
    // Rename to .webp so Cloudinary accepts it
    const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });
    formData.append("images", compressedFile);
  }

  const { data } = await api.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.urls;
};