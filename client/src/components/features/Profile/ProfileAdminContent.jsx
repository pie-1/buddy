// client/src/components/features/Profile/ProfileAdminContent.jsx
import { Link } from "react-router-dom";
import { FiShield, FiGlobe, FiActivity, FiCalendar } from "react-icons/fi";

export default function ProfileAdminContent({ user, adminStats, isOwn }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl bg-red-100 grid place-items-center shrink-0">
            <FiShield size={28} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">Platform staff</h2>
            <p className="text-sm text-stone-600 capitalize">{user.role} access · Actions are audited</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1 text-stone-500">
              <FiGlobe size={12} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Domains</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{adminStats?.verifications || 0}</div>
          </div>
          <div className="bg-white border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1 text-stone-500">
              <FiActivity size={12} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Reviews</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{adminStats?.reportsHandled || 0}</div>
          </div>
          <div className="bg-white border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1 text-stone-500">
              <FiCalendar size={12} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Events</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{adminStats?.eventsOrganized || 0}</div>
          </div>
        </div>

        <div className="bg-white border border-red-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Total impact</div>
            <div className="text-3xl font-black text-stone-900 mt-0.5">{adminStats?.impact || 0}</div>
          </div>
          <div className="text-xs text-stone-500 max-w-[140px] text-right leading-relaxed">
            Combined actions you've taken to keep the platform healthy.
          </div>
        </div>

        {isOwn && (
          <Link
            to="/admin"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold py-3.5 rounded-xl transition-all shadow-md"
          >
            Open admin dashboard →
          </Link>
        )}
      </div>
    </div>
  );
}