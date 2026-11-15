// client/src/pages/CreateHelpPost.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { createHelpPost } from "../services/helpService";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all text-sm";
const LABEL = "block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2";

const TAGS = ["Study help", "Project help", "Notes", "Career", "Mental support", "Housing", "Other"];

export default function CreateHelpPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", tags: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (t) =>
    setForm((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await createHelpPost(form);
      navigate(`/help/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create post");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to="/help" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6">
          <FiArrowLeft size={16} /> Back to help board
        </Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-indigo-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">New post</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">What do you need help with?</h1>
        </motion.div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-5">
          <div>
            <label className={LABEL}>Title</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className={INPUT} maxLength={120} placeholder="e.g. Need help understanding DBMS normalization" />
          </div>
          <div>
            <label className={LABEL}>Details</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required rows={6} className={`${INPUT} resize-none`} maxLength={800} placeholder="What's the problem? What have you tried? What kind of help do you need?" />
          </div>
          <div>
            <label className={LABEL}>Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button key={t} type="button" onClick={() => toggleTag(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${form.tags.includes(t) ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
            <Link to="/help" className="px-5 py-3 text-sm font-semibold text-stone-500 hover:text-stone-900">Cancel</Link>
            <motion.button type="submit" disabled={submitting} whileHover={!submitting ? { y: -1 } : undefined} className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-40">
              {submitting ? <><FiLoader size={14} className="animate-spin" /> Publishing…</> : "Publish"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}