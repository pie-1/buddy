// client/src/components/features/Marketplace/ImageDropzone.jsx
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, ImagePlus, Loader2, CheckCircle2 } from "lucide-react";
import { uploadImages } from "../../../services/uploadService";

export default function ImageDropzone({ images, onChange, max = 4 }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previews, setPreviews] = useState([]); // local blob previews while uploading

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const slots = max - images.length;
    const picked = Array.from(files).slice(0, slots);
    if (picked.length === 0) return;

    // Instant local previews
    const blobUrls = picked.map((f) => URL.createObjectURL(f));
    setPreviews(blobUrls);
    setUploading(true);
    setUploadError("");

    try {
      const cloudinaryUrls = await uploadImages(picked);
      onChange([...images, ...cloudinaryUrls]);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      setPreviews([]);
      blobUrls.forEach((u) => URL.revokeObjectURL(u));
    }
  };

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all px-6 py-10 text-center ${
          dragging ? "border-indigo-500 bg-indigo-500/10"
          : uploading ? "border-indigo-500/40 bg-indigo-500/[0.04] cursor-wait"
          : "border-white/15 bg-white/[0.03] hover:border-indigo-500/60 hover:bg-white/[0.05]"
        }`}
      >
        <motion.div
          animate={{ y: dragging ? -4 : 0, scale: uploading ? 0.9 : 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 mb-4"
        >
          {uploading ? <Loader2 size={24} className="text-indigo-400 animate-spin" /> : <UploadCloud size={24} className="text-indigo-400" />}
        </motion.div>
        <p className="text-white font-semibold mb-1">
          {uploading ? "Uploading to the cloud…" : dragging ? "Drop them here" : "Drag photos here, or click to browse"}
        </p>
        <p className="text-xs text-gray-500">Up to {max} images · JPG, PNG, WebP · max 5MB each</p>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">{uploadError}</div>
      )}

      {/* Uploaded thumbnails */}
      {(images.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 text-emerald-400">
                  <CheckCircle2 size={12} />
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm grid place-items-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
            {previews.map((src, i) => (
              <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-indigo-500/40 opacity-60">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 grid place-items-center">
                  <Loader2 size={18} className="text-white animate-spin" />
                </div>
              </div>
            ))}
          </AnimatePresence>
          {images.length < max && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border border-dashed border-white/15 hover:border-indigo-500/60 bg-white/[0.03] grid place-items-center text-gray-500 hover:text-indigo-400 transition-colors"
            >
              <ImagePlus size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}