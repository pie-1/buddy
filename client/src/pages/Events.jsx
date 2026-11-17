import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { fetchEvents } from "../services/eventService";
import EventCard from "../components/features/Events/EventCard";
import EventSkeleton from "../components/features/Events/EventSkeleton";
import EventFilterBar from "../components/features/Events/EventFilterBar";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const EASE = [0.22, 1, 0.36, 1];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ tag: "", mode: "", search: "", sort: "date-asc" });
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchEvents(filters);
        if (!cancelled) setEvents(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, filters.search ? 350 : 0);
    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
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
              <Sparkles size={12} /> The Radar
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.05] mb-3">
              What's happening,
              <span className="italic text-orange-700"> right now.</span>
            </h1>
            <p className="text-stone-500 text-lg">
              Hackathons, fests, workshops — everything on campus in one feed.
            </p>
          </div>
          <Link
            to="/events/new"
            className="shrink-0 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
          >
            <Plus size={16} /> Post an event
          </Link>
        </motion.div>

        <EventFilterBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white border border-stone-200 rounded-3xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-50 mb-4">
              <Calendar size={36} className="text-orange-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Nothing on the radar yet</h3>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              {filters.search || filters.tag || filters.mode
                ? "No events match your filters. Try clearing them."
                : "Be the first to post — a hackathon, a fest, a study session."}
            </p>
            <Link
              to="/events/new"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <Plus size={16} /> Post the first event
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            {events.map((e, i) => <EventCard key={e._id} event={e} index={i} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}