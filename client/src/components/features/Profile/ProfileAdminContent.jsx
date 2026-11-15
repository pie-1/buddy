// client/src/components/features/Profile/ProfileAdminContent.jsx
import { Link } from "react-router-dom";
import { FiShield, FiBriefcase } from "react-icons/fi";

export default function ProfileAdminContent({ user }) {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white grid place-items-center">
            <FiShield size={22} />
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900">
              {user.role === "admin" ? "Admin access" : "Moderator access"}
            </div>
            <p className="text-xs text-stone-600">Club-governed role. Actions are logged.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white rounded-xl p-3 border border-red-100">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Verifications</div>
            <div className="text-2xl font-black text-stone-900">—</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-100">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Reports handled</div>
            <div className="text-2xl font-black text-stone-900">—</div>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Open admin dashboard →
        </Link>
      </div>

      {user.bio && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">About</h2>
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">{user.bio}</p>
        </div>
      )}

      {user.department && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Affiliation</h2>
          <div className="flex items-center gap-2 text-stone-700">
            <FiBriefcase size={14} className="text-stone-400" />
            {user.college || user.university} · {user.department}
          </div>
        </div>
      )}
    </div>
  );
}