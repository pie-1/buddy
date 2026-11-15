// client/src/components/features/Marketplace/DetailGallery.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";

const isPdf = (url) => typeof url === "string" && url.toLowerCase().endsWith(".pdf");

export default function DetailGallery({ images = [], title = "" }) {
  const [active, setActive] = useState(0);
  const activeUrl = images[active];
  const activeIsPdf = isPdf(activeUrl);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-6xl text-white/10 font-serif">
        {title?.[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main viewer */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10">
        <AnimatePresence mode="wait">
          {activeIsPdf ? (
            <motion.a
              key={active}
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 grid place-items-center">
                <FileText size={36} className="text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold mb-1">PDF attached</p>
                <p className="text-gray-400 text-xs flex items-center gap-1 justify-center">
                  Open in new tab <ExternalLink size={12} />
                </p>
              </div>
            </motion.a>
          ) : (
            <motion.img
              key={active}
              src={activeUrl}
              alt={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => {
            const pdf = isPdf(url);
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition-all ${
                  active === i
                    ? "border-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.5)]"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                {pdf ? (
                  <div className="w-full h-full bg-red-500/10 grid place-items-center">
                    <FileText size={20} className="text-red-400" />
                  </div>
                ) : (
                  <img src={url} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}