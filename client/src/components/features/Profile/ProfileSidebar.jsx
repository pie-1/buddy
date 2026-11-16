// client/src/components/features/Profile/ProfileSidebar.jsx
import { Link } from "react-router-dom";
import { FiStar, FiShield, FiArrowRight } from "react-icons/fi";

export default function ProfileSidebar({ user, spotlight, isOwn, isAdminOrMod, listings, events, teamRequests, roommate }) {
  return (
    <div className="space-y-4">
      {isAdminOrMod ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">Role</div>
          <div className="flex items-center gap-2">
            <FiShield size={16} className="text-red-600" />
            <span className="text-sm font-bold text-stone-900 capitalize">{user.role}</span>
          </div>
          <div className="text-xs text-stone-500 mt-3">
            This is a platform staff role. Actions are audited.
          </div>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Activity</div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 grid place-items-center text-orange-600 font-bold text-sm">
              {listings?.length || 0}
            </div>
            <div className="text-xs text-stone-600 font-medium">Active listings</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 grid place-items-center text-indigo-600 font-bold text-sm">
              {events?.length || 0}
            </div>
            <div className="text-xs text-stone-600 font-medium">Events going</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-200 grid place-items-center text-violet-600 font-bold text-sm">
              {teamRequests?.length || 0}
            </div>
            <div className="text-xs text-stone-600 font-medium">Team requests</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 grid place-items-center text-amber-600 font-bold text-sm">
              {roommate ? 1 : 0}
            </div>
            <div className="text-xs text-stone-600 font-medium">Roommate profile</div>
          </div>
        </div>
      )}

      {isOwn && !isAdminOrMod && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <FiStar size={64} />
          </div>
          
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest text-purple-700 font-bold mb-2 flex items-center gap-1.5">
              <FiStar size={12} className="fill-purple-600" /> Spotlight
            </div>
            <p className="text-xs text-stone-700 leading-relaxed mb-4 font-medium pr-4">
              {spotlight?.active
                ? `You're spotlighted until ${new Date(spotlight.until).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`
                : "Get top placement on the Campus Directory for an entire week."}
            </p>
            
            {!spotlight?.active && (
              <Link 
                to="/spotlight" 
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-[0_4px_12px_-2px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_16px_-2px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"
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