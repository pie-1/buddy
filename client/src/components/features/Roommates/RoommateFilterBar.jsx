// client/src/components/features/Roommates/RoommateFilterBar.jsx
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const GENDERS = [
  { value: "any", label: "Any gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const ROOM_TYPES = [
  { value: "", label: "Any room" },
  { value: "single", label: "Single" },
  { value: "shared", label: "Shared" },
  { value: "entire-flat", label: "Entire flat" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "rent-asc", label: "Rent: low → high" },
  { value: "rent-desc", label: "Rent: high → low" },
];

const INPUT =
  "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer";

export default function RoommateFilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="bg-[#14121f]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 mb-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <div className="col-span-2 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={filters.area}
            onChange={set("area")}
            placeholder="Search by area..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
          />
        </div>

        <select value={filters.gender} onChange={set("gender")} className={INPUT}>
          {GENDERS.map((g) => <option key={g.value} value={g.value} className="bg-[#14121f]">{g.label}</option>)}
        </select>

        <select value={filters.roomType} onChange={set("roomType")} className={INPUT}>
          {ROOM_TYPES.map((r) => <option key={r.value} value={r.value} className="bg-[#14121f]">{r.label}</option>)}
        </select>

        <select value={filters.sort} onChange={set("sort")} className={INPUT}>
          {SORTS.map((s) => <option key={s.value} value={s.value} className="bg-[#14121f]">{s.label}</option>)}
        </select>

        <div className="flex gap-2">
          <input
            type="number" min={0} placeholder="Min"
            value={filters.minRent}
            onChange={set("minRent")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <input
            type="number" min={0} placeholder="Max"
            value={filters.maxRent}
            onChange={set("maxRent")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>
    </motion.div>
  );
}