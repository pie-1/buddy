// client/src/components/features/Marketplace/SellerCard.jsx
import { ShieldCheck, GraduationCap, Building2 } from "lucide-react";

export default function SellerCard({ seller }) {
  if (!seller) return null;

  const initial = seller.name?.[0]?.toUpperCase() || "?";
  const isAlumni = seller.isAlumni;

  return (
    <div className="bg-[#14121f] border border-white/10 rounded-2xl p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-500 mb-4">Posted by</p>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold text-lg shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold truncate">{seller.name || "Unknown"}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <Building2 size={11} /> {seller.university || "Unknown"} Node
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
            <ShieldCheck size={12} /> Trust
          </div>
          <div className="text-white font-black text-lg leading-none">{seller.trustScore ?? 0}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold mb-0.5">
            <GraduationCap size={12} /> {isAlumni ? "Alumni" : "Student"}
          </div>
          <div className="text-white font-black text-lg leading-none">
            {seller.graduationYear || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}