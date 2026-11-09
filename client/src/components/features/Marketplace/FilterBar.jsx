// client/src/components/features/Marketplace/FilterBar.jsx
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "sell", label: "Buy / Sell" },
  { value: "rent", label: "Rent" },
  { value: "borrow", label: "Borrow" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
];

export default function FilterBar({ category, sort, search, onCategoryChange, onSortChange, onSearchChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="relative bg-[#14121f]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col md:flex-row gap-3 mb-10"
    >
      <div className="relative flex-1 group">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search titles, descriptions..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all"
        />
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors min-w-[170px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#14121f]">{c.label}</option>
            ))}
          </select>
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors min-w-[170px]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#14121f]">{s.label}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}