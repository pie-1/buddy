// client/src/components/features/Marketplace/ListingPreviewCard.jsx
import { motion } from "framer-motion";
import { CATEGORIES, formatPrice } from "../../../constants/marketplace";

export default function ListingPreviewCard({ form, images, sellerName }) {
  const cat = CATEGORIES[form.category] || CATEGORIES.sell;
  const cover = images?.[0];
  const initial = sellerName?.[0]?.toUpperCase() || "?";

  return (
    <div className="sticky top-32">
      <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-500 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live preview
      </p>

      <motion.div layout className="bg-[#14121f] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]">
        <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
          {cover ? (
            <img src={cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">{cat.emoji}</div>
          )}
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 ${cat.pillClass}`}>
            <span>{cat.emoji}</span> {cat.label}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2">
            {form.title || "Your listing title"}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {form.description || "Your description will appear here..."}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Price</div>
              <div className="text-xl font-black text-white tracking-tight">
                {form.price ? formatPrice(form.price, form.category, form.rentPeriod) : "Rs. —"}
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white text-xs font-bold">
                {initial}
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-0.5 font-bold">Seller</div>
                <div className="text-xs text-gray-300">{sellerName || "You"}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}