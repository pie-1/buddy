// client/src/components/features/Marketplace/ListingCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Star } from "lucide-react";
import { CATEGORIES, STATUS, isPdf, formatPrice } from "../../../constants/marketplace";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ListingCard({ listing, index = 0 }) {
  const cat = CATEGORIES[listing.category] || CATEGORIES.sell;
  const images = listing.images || [];
  const cover = images[0];
  const hasPdf = images.some(isPdf);
  const priceLabel = formatPrice(listing.price, listing.category, listing.rentPeriod);
  const seller = listing.sellerId;
  const statusMeta = listing.status !== "active" ? STATUS[listing.status] : null;
  const isSpotlight = seller?.spotlightUntil && new Date(seller.spotlightUntil) > new Date();

  const coverIsPdf = isPdf(cover);
  const nonPdfImage = images.find((u) => !isPdf(u));
  const displayCover = coverIsPdf ? nonPdfImage : cover;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/marketplace/${listing._id}`}
        className={`relative flex flex-col h-full bg-[#14121f] border rounded-2xl overflow-hidden transition-all duration-300 ${
          isSpotlight ? "border-purple-500/50 hover:border-purple-400" : "border-white/10 hover:border-white/25"
        }`}
        style={{
          boxShadow: isSpotlight
            ? "0 0 24px -6px rgba(139,92,246,0.4)"
            : "0 8px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${cat.glow}, transparent 60%)` }}
        />

        {/* media — aspect ratio keeps images uncropped-looking and consistent */}
        <div className="relative aspect-[4/3] bg-white/5 overflow-hidden shrink-0">
          {displayCover ? (
            <img
              src={displayCover}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : coverIsPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-red-400/60">
              <FileText size={48} />
              <span className="text-[10px] font-bold uppercase tracking-widest">PDF attached</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-white/[0.06] font-serif">
              {listing.title?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${cat.pillClass}`}>
            {cat.label}
          </span>

          {isSpotlight && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              <Star size={9} fill="currentColor" /> Spotlight
            </span>
          )}

          {hasPdf && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-200 backdrop-blur-md">
              <FileText size={10} /> PDF
            </span>
          )}

          {statusMeta && (
            <span className={`absolute bottom-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${statusMeta.cls}`}>
              {statusMeta.label}
            </span>
          )}
        </div>

        <div className="relative p-5 flex flex-col flex-1">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{listing.description}</p>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Price</div>
              <div className="text-xl font-black text-white tracking-tight">{priceLabel}</div>
            </div>

            {seller && (
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Seller</div>
                <div className="flex items-center justify-end gap-1.5 text-xs text-gray-300">
                  <span className="truncate max-w-[110px]">{seller.name}</span>
                  {seller.trustScore > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold">
                      <ShieldCheck size={11} /> {seller.trustScore}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}