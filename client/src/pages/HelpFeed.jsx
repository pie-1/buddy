// client/src/pages/HelpFeed.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiHelpCircle, FiLoader, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { fetchHelpPosts } from "../services/helpService";

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

export default function HelpFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchHelpPosts({ status });
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load help posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-indigo-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">Help board</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Ask the campus.
            </h1>
            <p className="text-stone-500 mt-2">Study help, project questions, notes, anything.</p>
          </div>
          <Link to="/help/new" className="shrink-0 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors">
            <FiPlus size={16} /> Ask for help
          </Link>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                status === f.value ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <FiLoader className="animate-spin text-orange-500" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-200 rounded-2xl">
            <FiHelpCircle size={48} className="text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No help posts yet</h3>
            <p className="text-stone-500 text-sm mb-6">Be the first to ask something.</p>
            <Link to="/help/new" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-5 py-3 rounded-xl">
              <FiPlus size={16} /> Ask for help
            </Link>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {posts.map((post) => (
              <motion.div key={post._id} variants={cardVariant}>
                <Link to={`/help/${post._id}`} className="group block bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-5 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 grid place-items-center text-white text-[10px] font-bold">
                        {post.authorId?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-stone-700">{post.authorId?.name}</span>
                      {post.status === "resolved" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <FiCheckCircle size={10} /> Resolved
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">{new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-1 group-hover:text-orange-700 transition-colors">{post.title}</h3>
                  <p className="text-sm text-stone-600 line-clamp-2 mb-3">{post.description}</p>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold">{post.replies?.length || 0} replies</span>
                    {post.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">{t}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}