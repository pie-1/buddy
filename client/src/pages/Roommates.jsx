// client/src/pages/Roommates.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Home, Search } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { fetchRoommates } from "../services/roommateService";
import RoommateCard from "../components/features/Roommates/RoommateCard";
import RoommateSkeleton from "../components/features/Roommates/RoommateSkeleton";
import RoommateFilterBar from "../components/features/Roommates/RoommateFilterBar";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const EASE = [0.22, 1, 0.36, 1];

const MODES = [
  { value: "have-room", label: "I'm looking for a room", icon: Search, hint: "See people who have a room" },
  { value: "looking-for-room", label: "I have a room", icon: Home, hint: "See people looking for a room" },
  { value: "", label: "Browse all", icon: null, hint: "See everyone" },
];

export default function Roommates() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [filters, setFilters] = useState({ area: "", gender: "any", roomType: "", minRent: "", maxRent: "", sort: "newest" });
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRoommates({ ...filters, kind: mode });
        if (!cancelled) setListings(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load profiles");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, filters.area ? 350 : 0);
    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
  }, [filters, mode]);

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,.15), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div className="max-w-2xl">
            <p className="text-orange-400 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">Roommates</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.05] mb-3">
              Find a flatmate,
              <span className="italic text-orange-400"> not a stranger.</span>
            </h1>
            <p className="text-gray-400 text-lg">Profiles from verified students — with or without a room.</p>
          </div>
          <Link
            to="/roommates/new"
            className="shrink-0 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:-translate-y-0.5"
          >
            <Plus size={16} /> Post your profile
          </Link>
        </motion.div>

        {/* Mode selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {MODES.map((m) => {
            const active = mode === m.value;
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  active
                    ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {Icon && <Icon size={16} className={active ? "text-orange-400" : "text-gray-400"} />}
                  <span className="font-bold text-white text-sm">{m.label}</span>
                </div>
                <div className="text-xs text-gray-400">{m.hint}</div>
              </button>
            );
          })}
        </div>

        <RoommateFilterBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <RoommateSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 mb-6">
              <Home size={40} className="text-white/20" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No profiles yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Be the first to post your roommate profile and get discovered.
            </p>
            <Link to="/roommates/new" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(249,115,22,0.35)]">
              <Plus size={16} /> Post your profile
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l, i) => <RoommateCard key={l._id} listing={l} index={i} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}