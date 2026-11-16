// client/src/components/features/Profile/ProfileTabs.jsx
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "listings", label: "Listings" },
  { key: "roommate", label: "Roommate" },
  { key: "events", label: "Events" },
  { key: "team", label: "Teams" },
  { key: "help", label: "Help" },
];

export default function ProfileTabs({ active, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-stone-200 mb-6">
      {TABS.map((t) => {
        const isActive = active === t.key;
        const count = counts[t.key];
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "text-orange-700"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {t.label}
            {count > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-orange-100 text-orange-700" : "bg-stone-100 text-stone-500"}`}>
                {count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}