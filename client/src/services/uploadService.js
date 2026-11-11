// client/src/services/uploadService.js
import api from "./api";
import { squish } from "squish-image";

const MAX_PDFS = 2;
const MAX_FILES = 4;
const MAX_MB = 5;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
const fail = (message) => Promise.reject({ response: { data: { message } } });

async function compressImage(file) {
  try {
    const result = await squish(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      format: "image/webp",
    });
    const blob = result.blob || result;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });
  } catch (err) {
    console.warn("Compression failed, sending original:", err);
    return file;
  }
}

export const uploadFiles = async (files) => {
  const list = Array.from(files || []);
  if (list.length === 0) return [];

  if (list.length > MAX_FILES) return fail(`You can upload up to ${MAX_FILES} files`);
  if (list.filter(isPdf).length > MAX_PDFS) return fail(`You can attach up to ${MAX_PDFS} PDFs`);

  const bad = list.find((f) => !OK_TYPES.includes(f.type) && !isPdf(f));
  if (bad) return fail(`"${bad.name}" isn't supported. Use JPG, PNG, WEBP or PDF.`);

  const formData = new FormData();
  for (const file of list) {
    const out = isPdf(file) ? file : await compressImage(file);
    if (out.size > MAX_MB * 1024 * 1024) return fail(`"${file.name}" is over ${MAX_MB}MB`);
    formData.append("images", out);
  }

  const { data } = await api.post("/upload/images", formData);
  return data.files; // [{url, thumb, isPdf}]
};