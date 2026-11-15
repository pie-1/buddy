// client/src/components/features/Profile/ProfileBadge.jsx
import { FiBookOpen, FiBriefcase, FiShield, FiStar, FiMapPin } from "react-icons/fi";

export function StatusPill({ user }) {
  if (!user) return null;

  const isAlumni = user.graduationYear && user.graduationYear <= new Date().getFullYear();
  const yearShort = user.graduationYear ? String(user.graduationYear).slice(-2) : "";

  if (isAlumni) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
        <FiBriefcase size={11} />
        {user.company ? `Alumni · ${user.company}` : `Alumni '${yearShort}`}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <FiBookOpen size={11} />
      {user.department ? `Studying · ${user.department}` : "Studying"}
      {yearShort && ` '${yearShort}`}
    </span>
  );
}

export function RoleBadge({ user }) {
  if (!user) return null;
  if (user.role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
        <FiShield size={9} /> Admin
      </span>
    );
  }
  if (user.role === "moderator") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
        <FiShield size={9} /> Moderator
      </span>
    );
  }
  return null;
}

export function SpotlightBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
      <FiStar size={9} fill="currentColor" /> Spotlight
    </span>
  );
}

export function CollegePill({ user }) {
  if (!user?.college && !user?.university) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-stone-500">
      <FiMapPin size={10} />
      {user.college || `${user.university} Node`}
    </span>
  );
}