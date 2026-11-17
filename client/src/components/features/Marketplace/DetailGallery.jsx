// client/src/components/features/Marketplace/DetailGallery.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { isPdf } from "../../../constants/marketplace";

export default function DetailGallery({ images = [], title = "" }) {
  const [active, setActive] = useState(0);
  const activeUrl = images[active];
  const activeIsPdf = isPdf(activeUrl);

  useEffect(() => {
    setActive(0);
  }, [images.length]);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-6xl text-white/10 font-serif">
        {title?.[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
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

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 grid place-items-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 grid place-items-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

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