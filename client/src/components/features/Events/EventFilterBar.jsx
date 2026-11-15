// client/src/components/features/Events/EventFilterBar.jsx
import { Search, X } from "lucide-react";

export const TAGS = [
  "Tech", "AI", "Health", "Education", "Environment",
  "Cybersecurity", "Business", "Community", "Engineering", "Sports",
];

const TAG_ACTIVE = {
  Tech: "bg-sky-600 text-white border-sky-600",
  AI: "bg-violet-600 text-white border-violet-600",
  Health: "bg-rose-600 text-white border-rose-600",
  Education: "bg-amber-500 text-white border-amber-500",
  Environment: "bg-emerald-600 text-white border-emerald-600",
  Cybersecurity: "bg-blue-600 text-white border-blue-600",
  Business: "bg-yellow-500 text-white border-yellow-500",
  Community: "bg-orange-600 text-white border-orange-600",
  Engineering: "bg-slate-700 text-white border-slate-700",
  Sports: "bg-green-600 text-white border-green-600",
};

const MODES = [
  { value: "", label: "All modes" },
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const SORTS = [
  { value: "date-asc", label: "Soonest first" },
  { value: "date-desc", label: "Latest first" },
];

const SELECT =
  "bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 cursor-pointer";

export default function EventFilterBar({ filters, onChange }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });
  const hasAnyFilter = filters.tag || filters.mode || filters.search;

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange({ ...filters, tag: "" })}
          className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
            !filters.tag
              ? "bg-stone-900 text-white border-stone-900"
              : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
          }`}
        >
          All events
        </button>
        {TAGS.map((tag) => {
          const active = filters.tag === tag;
          return (
            <button
              key={tag}
              onClick={() => onChange({ ...filters, tag: active ? "" : tag })}
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                active ? TAG_ACTIVE[tag] : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={filters.search}
            onChange={set("search")}
            placeholder="Search by name, venue, description..."
            className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select value={filters.mode} onChange={set("mode")} className={SELECT}>
          {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={filters.sort} onChange={set("sort")} className={SELECT}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {hasAnyFilter && (
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>Filters active</span>
          <span className="text-stone-300">•</span>
          <button
            onClick={() => onChange({ tag: "", mode: "", search: "", sort: "date-asc" })}
            className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}