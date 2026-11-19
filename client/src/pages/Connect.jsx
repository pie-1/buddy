import { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiUsers, FiLoader, FiAlertCircle, FiX, FiStar, FiCalendar, FiArrowRight } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchDirectory } from "../services/userService";
import { fetchCurrentSpotlight } from "../services/spotlightService";
import UserCard from "../components/features/Connect/UserCard";

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

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

export default function Connect() {
  const { user: me } = useContext(AuthContext);
  const [spotlightedUsers, setSpotlightedUsers] = useState([]);
  const [spotlightedEvents, setSpotlightedEvents] = useState([]);
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
        const [directoryData, spotlightData] = await Promise.all([
          fetchDirectory(filters),
          fetchCurrentSpotlight(),
        ]);
        setUsers(directoryData?.all || []);
        setSpotlightedUsers(spotlightData.users || []);
        setSpotlightedEvents(spotlightData.events || []);
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

  const hasSpotlightData = spotlightedUsers.length > 0 || spotlightedEvents.length > 0;
  const isFiltering = filters.search || filters.department !== "All" || filters.role !== "All";
  const showSpotlight = hasSpotlightData && !isFiltering;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(251,146,60,.08), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
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
          <Link to="/profile/me" className="shrink-0 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]">
            My profile →
          </Link>
        </motion.div>

        {/* Spotlight Section */}
        {showSpotlight && (
          <div className="mb-16 space-y-12">
            
            {spotlightedUsers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-purple-100 pb-4">
                  <div className="flex items-center gap-2">
                    <FiStar size={16} className="text-purple-600" fill="currentColor" />
                    <h2 className="text-lg font-bold uppercase tracking-widest text-purple-700">
                      Spotlighted Students
                    </h2>
                  </div>
                  <Link to="/spotlight" className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1">
                    See full lineup <FiArrowRight size={12} />
                  </Link>
                </div>
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spotlightedUsers.map((u, i) => (
                    <UserCard key={u._id} user={u} isOwn={me?._id === u._id} isSpotlighted={true} rank={i + 1} />
                  ))}
                </motion.div>
              </div>
            )}

            {spotlightedEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-orange-100 pb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={16} className="text-orange-600" />
                    <h2 className="text-lg font-bold uppercase tracking-widest text-orange-700">
                      Spotlighted Events
                    </h2>
                  </div>
                  <Link to="/spotlight" className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1">
                    See full lineup <FiArrowRight size={12} />
                  </Link>
                </div>
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spotlightedEvents.map((e, i) => (
                    <motion.div key={e._id} variants={container}>
                      <Link to={`/events/${e._id}`} className="group flex flex-col h-[380px] rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-red-50 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.2)] overflow-hidden hover:border-orange-400 transition-all">
                        <div className="relative h-40 bg-stone-100 shrink-0">
                          {e.coverImage ? (
                            <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-300">
                              <FiCalendar size={48} />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <FiStar size={10} fill="currentColor" /> Rank #{i + 1}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-xl font-serif font-bold text-stone-900 mb-1 leading-snug line-clamp-2">{e.title}</h3>
                          <p className="text-xs text-stone-500 font-medium mb-3">{new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {e.venue}</p>
                          <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">{e.description}</p>
                          <div className="mt-auto pt-3 border-t border-orange-100 text-orange-700 text-xs font-bold flex items-center justify-between">
                            View Event Details <span>→</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-2 flex flex-col md:flex-row gap-2 mb-8 shadow-sm relative z-20">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by name, bio, skills..."
              className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {filters.search && (
              <button onClick={() => setFilters((f) => ({ ...f, search: "" }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                <FiX size={14} />
              </button>
            )}
          </div>
          <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))} className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer">
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))} className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer">
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><FiLoader className="animate-spin text-orange-500" size={32} /></div>
        ) : users.length === 0 && spotlightedUsers.length === 0 && spotlightedEvents.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-200 rounded-2xl">
            <FiUsers size={48} className="text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No one matches those filters</h3>
            <p className="text-stone-500 text-sm mb-6">Try clearing them.</p>
            <button onClick={() => setFilters({ search: "", department: "All", role: "All" })} className="text-sm font-semibold text-orange-700 hover:text-orange-900">Clear filters →</button>
          </div>
        ) : (
          <div className="pt-4">
             <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-6 pb-2 border-b border-stone-200">All Members</h2>
             <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <UserCard key={u._id} user={u} isOwn={me?._id === u._id} isSpotlighted={false} />
                ))}
              </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}