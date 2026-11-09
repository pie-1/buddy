// client/src/pages/Marketplace.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, ShoppingBag } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { fetchListings } from "../services/listingService";
import ListingCard from "../components/features/Marketplace/ListingCard";
import ListingSkeleton from "../components/features/Marketplace/ListingSkeleton";
import FilterBar from "../components/features/Marketplace/FilterBar";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchListings({ category, sort, search });
        if (!cancelled) setListings(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, search ? 350 : 0);
    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
  }, [category, sort, search]);

  const stats = useMemo(() => {
    const counts = { sell: 0, rent: 0, borrow: 0 };
    listings.forEach((l) => {
      if (counts[l.category] !== undefined) counts[l.category]++;
    });
    return counts;
  }, [listings]);

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />

      {/* Ambient glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,.22), transparent 65%)" }} />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,.08), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <p className="text-indigo-400 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">Marketplace</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.05] mb-3">
              Campus trade,
              <span className="italic text-indigo-400"> verified.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Buy, sell, rent, or borrow — only from students at your university.
            </p>
          </div>

          <Link
            to="/marketplace/new"
            className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(79,70,229,0.35)] hover:shadow-[0_0_32px_rgba(79,70,229,0.5)] hover:-translate-y-0.5"
          >
            <Plus size={16} /> Post a listing
          </Link>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "For sale", value: stats.sell, color: "text-indigo-300" },
            { label: "For rent", value: stats.rent, color: "text-orange-300" },
            { label: "To borrow", value: stats.borrow, color: "text-emerald-300" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <FilterBar
          category={category}
          sort={sort}
          search={search}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onSearchChange={setSearch}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 relative"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 mb-6">
              <ShoppingBag size={40} className="text-white/20" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Nothing here yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {search || category !== "all"
                ? "No listings match your filters. Try clearing the search or category."
                : "Be the first to post something — someone on campus is looking for exactly what you have."}
            </p>
            <Link
              to="/marketplace/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(79,70,229,0.35)]"
            >
              <Plus size={16} /> Create your first listing
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {listings.map((listing, i) => (
              <ListingCard key={listing._id} listing={listing} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}