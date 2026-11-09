// client/src/components/features/Marketplace/ListingCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const CATEGORY = {
  sell: { label: "Sell", cls: "text-indigo-300 border-indigo-500/30 bg-indigo-500/10", glow: "rgba(99,102,241,0.4)" },
  buy: { label: "Buy", cls: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10", glow: "rgba(6,182,212,0.4)" },
  rent: { label: "Rent", cls: "text-orange-300 border-orange-500/30 bg-orange-500/10", glow: "rgba(249,115,22,0.4)" },
  borrow: { label: "Borrow", cls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10", glow: "rgba(16,185,129,0.4)" },
};

const PRICE_FORMAT = {
  sell: (p) => `Rs. ${p.toLocaleString()}`,
  buy: (p) => `Rs. ${p.toLocaleString()}`,
  rent: (p, period) => `Rs. ${p.toLocaleString()} / ${period || "day"}`,
  borrow: (p, period) => `Rs. ${p.toLocaleString()} / ${period || "day"}`,
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ListingCard({ listing, index = 0 }) {
  const cat = CATEGORY[listing.category] || CATEGORY.sell;
  const cover = listing.images?.[0];
  const priceLabel = (PRICE_FORMAT[listing.category] || PRICE_FORMAT.sell)(listing.price, listing.rentPeriod);
  const seller = listing.sellerId;
  const statusBadge = listing.status !== "active" && listing.status;

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
        className="relative block h-full flex flex-col bg-[#14121f] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300"
        style={{ boxShadow: "0 8px 24px -12px rgba(0,0,0,0.6)" }}
      >
        {/* gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${cat.glow}, transparent 60%)` }}
        />

        {/* media */}
        <div className="relative h-44 bg-white/5 overflow-hidden shrink-0">
          {cover ? (
            <img
              src={cover}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-white/[0.06] font-serif">
              {listing.title?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          {/* category pill */}
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${cat.cls}`}>
            {cat.label}
          </span>

          {/* status pill */}
          {statusBadge && (
            <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-500/40 bg-red-500/20 text-red-200 backdrop-blur-md">
              {listing.status}
            </span>
          )}
        </div>

        {/* body */}
        <div className="relative p-5 flex flex-col flex-1">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{listing.description}</p>

          {/* price block, slides up subtly on hover */}
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