// client/src/components/features/Marketplace/StatusControl.jsx
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { STATUS, OWNER_STATUS_OPTIONS } from "../../../constants/marketplace";
import { updateListingStatus } from "../../../services/listingService";

export default function StatusControl({ listing, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const next = e.target.value;
    if (next === listing.status) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateListingStatus(listing._id, next);
      onChange(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">
        Listing status
      </div>
      <div className="relative">
        <select
          value={listing.status}
          onChange={handleChange}
          disabled={saving}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors disabled:opacity-50"
        >
          {OWNER_STATUS_OPTIONS.map((v) => (
            <option key={v} value={v} className="bg-[#14121f]">
              {STATUS[v]?.label || v}
            </option>
          ))}
        </select>
        {saving && (
          <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin" />
        )}
      </div>
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}