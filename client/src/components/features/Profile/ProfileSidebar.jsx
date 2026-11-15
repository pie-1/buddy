// client/src/components/features/Profile/ProfileSidebar.jsx
import { FiStar, FiShield } from "react-icons/fi";

export default function ProfileSidebar({ user, spotlight, isOwn, isAdminOrMod, listings, events, teamRequests, roommate }) {
  return (
    <>
      {isAdminOrMod ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
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
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Activity</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 grid place-items-center text-orange-600 font-bold text-sm">{listings.length}</div>
            <div className="text-xs text-stone-600">Active listings</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 grid place-items-center text-indigo-600 font-bold text-sm">{events.length}</div>
            <div className="text-xs text-stone-600">Events going</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-200 grid place-items-center text-violet-600 font-bold text-sm">{teamRequests.length}</div>
            <div className="text-xs text-stone-600">Team requests</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 grid place-items-center text-amber-600 font-bold text-sm">{roommate ? 1 : 0}</div>
            <div className="text-xs text-stone-600">Roommate profile</div>
          </div>
        </div>
      )}

      {isOwn && !isAdminOrMod && (
        <div className="mt-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-purple-600 font-bold mb-2 flex items-center gap-1.5">
            <FiStar size={11} /> Spotlight
          </div>
          <p className="text-xs text-stone-700 leading-relaxed mb-3">
            {spotlight?.active
              ? `You're spotlighted until ${new Date(spotlight.until).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`
              : "Get top placement on Connect for a week. Rs. 50."}
          </p>
          {!spotlight?.active && (
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg">
              Get Spotlight
            </button>
          )}
        </div>
      )}
    </>
  );
}