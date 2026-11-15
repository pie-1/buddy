// client/src/pages/Spotlight.jsx
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiLoader, FiAlertCircle, FiArrowRight, FiClock } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchCurrentSpotlight, fetchMyClaims } from "../services/spotlightService";

const EASE = [0.22, 1, 0.36, 1];

export default function Spotlight() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [spotlight, setSpotlight] = useState(null);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cur, claims] = await Promise.all([
          fetchCurrentSpotlight(),
          user ? fetchMyClaims().catch(() => []) : [],
        ]);
        setSpotlight(cur);
        setMyClaims(claims || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load spotlight");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const hasPending = myClaims.some((c) => c.status === "pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <FiLoader className="animate-spin text-orange-500" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(139,92,246,.12), transparent 65%)" }} />

      <div className="relative max-w-5xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="text-center mb-12">
          <p className="text-purple-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-3 inline-flex items-center gap-2">
            <FiStar size={12} /> This week's spotlight
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.05] mb-3">
            Three students,
            <span className="italic text-purple-700"> on top.</span>
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            {spotlight?.label} · Their profiles, listings and posts rank first across the platform.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {/* Spotlight lineup */}
        {spotlight?.users?.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl mb-8">
            <FiStar size={48} className="text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 mb-2">No one is spotlighted this week — yet.</p>
            <p className="text-xs text-stone-400">Be the first to claim a slot below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {spotlight.users.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              >
                <Link
                  to={`/profile/${u._id}`}
                  className="group block bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-2 border-purple-200 hover:border-purple-400 rounded-3xl p-6 transition-all shadow-[0_8px_32px_-12px_rgba(139,92,246,0.25)]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100 border border-purple-200 px-2 py-1 rounded-full">
                      Rank #{i + 1}
                    </span>
                    <FiStar size={16} className="text-purple-500" fill="currentColor" />
                  </div>
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-purple-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 grid place-items-center text-white text-2xl font-bold mb-4">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-1 group-hover:text-purple-800 transition-colors">{u.name}</h3>
                  <p className="text-xs text-stone-500 mb-3">{u.college || u.university}</p>
                  {u.bio && <p className="text-sm text-stone-600 line-clamp-2">{u.bio}</p>}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Purchase card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white border border-stone-200 rounded-3xl p-8"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest text-purple-600 font-bold mb-2 flex items-center gap-2">
                  <FiClock size={11} /> Next week's slots
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  Want to be at the top next week?
                </h2>
                <p className="text-stone-500 text-sm">
                  Rs. 50 · Pay via eSewa · Get verified by the club · Take one of 3 weekly slots.
                </p>
              </div>
              <button
                onClick={() => navigate("/spotlight/claim")}
                disabled={hasPending}
                className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(139,92,246,0.5)] disabled:opacity-50"
              >
                {hasPending ? "Claim pending…" : <>Get Spotlight <FiArrowRight size={16} /></>}
              </button>
            </div>

            {myClaims.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">My claims</div>
                <div className="space-y-2">
                  {myClaims.slice(0, 5).map((c) => (
                    <div key={c._id} className="flex items-center justify-between text-xs bg-stone-50 rounded-lg px-3 py-2">
                      <span className="text-stone-600">
                        {new Date(c.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "verified" ? "bg-emerald-100 text-emerald-700"
                        : c.status === "rejected" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!user && (
          <div className="text-center bg-white border border-stone-200 rounded-2xl p-8">
            <p className="text-stone-600 mb-4">Log in to claim a spotlight slot.</p>
            <Link to="/auth" className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-semibold px-6 py-3 rounded-xl">
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}