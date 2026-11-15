// client/src/pages/Connect.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiUsers, FiLoader, FiAlertCircle, FiX } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchDirectory } from "../services/userService";
import { StatusPill, RoleBadge, SpotlightBadge, CollegePill } from "../components/features/Profile/ProfileBadge";

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const DEPARTMENTS = [
  "All", "Computer Science", "Information Technology", "Electronics", "Electrical",
  "Mechanical", "Civil", "Architecture", "Business", "Design", "Other",
];

const ROLES = [
  { value: "All", label: "All roles" },
  { value: "student", label: "Students" },
  { value: "moderator", label: "Moderators" },
  { value: "admin", label: "Admins" },
];

function ProfileCard({ user, me }) {
  const isMe = me && me._id === user._id;
  const isAlumni = user.graduationYear <= new Date().getFullYear();

  return (
    <motion.div variants={cardVariant}>
      <Link
        to={`/profile/${user._id}`}
        className="group block bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-5 transition-all hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-stone-200" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 grid place-items-center text-white text-2xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            {user.spotlightUntil && new Date(user.spotlightUntil) > new Date() && (
              <div className="absolute -top-1 -right-1">
                <SpotlightBadge />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-orange-700 transition-colors truncate">
                  {user.name}
                  {isMe && <span className="text-xs font-sans font-normal text-stone-400 ml-2">(you)</span>}
                </h3>
                <CollegePill user={user} />
              </div>
              <RoleBadge user={user} />
            </div>

            <div className="mt-2 mb-2">
              <StatusPill user={user} />
            </div>

            {user.bio && (
              <p className="text-sm text-stone-600 line-clamp-2 mt-2">{user.bio}</p>
            )}

            {user.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {user.skills.slice(0, 4).map((s) => (
                  <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                    {s}
                  </span>
                ))}
                {user.skills.length > 4 && (
                  <span className="text-[10px] font-semibold text-stone-400 px-1">+{user.skills.length - 4}</span>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Trust <span className="font-bold text-stone-700">{user.trustScore || 0}</span>
              </span>
              <span className="text-orange-600 font-semibold group-hover:text-orange-700">
                View profile →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Connect() {
  const { user: me } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", department: "All", role: "All" });
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchDirectory(filters);
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load directory");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, filters.search ? 300 : 0);
    return () => { cancelled = true; clearTimeout(debounceRef.current); };
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(251,146,60,.08), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <p className="text-orange-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-3 inline-flex items-center gap-2">
              <FiUsers size={12} /> Campus directory
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.05] mb-3">
              Everyone on campus,
              <span className="italic text-orange-700"> in one place.</span>
            </h1>
            <p className="text-stone-500 text-lg">
              Verified students, alumni, moderators. Browse, filter, and connect.
            </p>
          </div>
          <Link
            to="/profile/me"
            className="shrink-0 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
          >
            My profile →
          </Link>
        </motion.div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-2 flex flex-col md:flex-row gap-2 mb-8">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by name, bio, skills..."
              className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <select
            value={filters.department}
            onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
            className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
            className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 flex gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-stone-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-3 bg-stone-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-200 rounded-2xl">
            <FiUsers size={48} className="text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No one matches those filters</h3>
            <p className="text-stone-500 text-sm mb-6">Try clearing them to see everyone.</p>
            <button
              onClick={() => setFilters({ search: "", department: "All", role: "All" })}
              className="text-sm font-semibold text-orange-700 hover:text-orange-900"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {users.map((u) => <ProfileCard key={u._id} user={u} me={me} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}