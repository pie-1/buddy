import { Link } from "react-router-dom";
import { FiStar, FiShield, FiArrowRight } from "react-icons/fi";

export default function ProfileSidebar({ user, spotlight, isOwn, isAdminOrMod }) {
  return (
    <div className="space-y-4">
      {isAdminOrMod && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">Staff Role</div>
          <div className="flex items-center gap-2">
            <FiShield size={16} className="text-red-600" />
            <span className="text-sm font-bold text-stone-900 capitalize">{user.role}</span>
          </div>
          <div className="text-xs text-stone-500 mt-3 leading-relaxed">
            This is a platform staff role. Admin actions are audited and logged.
          </div>
        </div>
      )}

      {isOwn && !isAdminOrMod && (
        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#09090b] border border-indigo-500/30 rounded-2xl p-5 shadow-lg overflow-hidden relative group text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <FiStar size={64} />
          </div>
          
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <FiStar size={12} className="fill-amber-400" /> Spotlight
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4 font-medium pr-4">
              {spotlight?.active
                ? `You're spotlighted until ${new Date(spotlight.until).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`
                : "Get top placement on the Campus Directory and every feed for a week."}
            </p>
            
            {!spotlight?.active && (
              <Link 
                to="/spotlight" 
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold py-2.5 rounded-lg transition-all shadow-[0_4px_12px_-2px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_16px_-2px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
              >
                Get Spotlight <FiArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}