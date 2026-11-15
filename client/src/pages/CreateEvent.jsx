// client/src/pages/CreateEvent.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { createEvent } from "../services/eventService";
import ImageDropzone from "../components/features/Marketplace/ImageDropzone";
import { TAGS } from "../components/features/Events/EventFilterBar";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all text-sm";
const LABEL = "block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", date: "", endDate: "", registrationDeadline: "",
    venue: "", mode: "offline", cost: "Free", registrationLink: "", organizerName: "",
    tags: [],
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form, coverImage: files[0]?.url || null };
      const created = await createEvent(payload);
      navigate(`/events/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create event");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to events
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <p className="text-orange-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">New event</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Put it on the radar.</h1>
        </motion.div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <label className={LABEL}>Banner image</label>
            <ImageDropzone files={files} onChange={setFiles} max={1} />
          </div>

          <div>
            <label className={LABEL}>Event title</label>
            <input value={form.title} onChange={onChange("title")} required className={INPUT} placeholder="e.g. INNEX 2026: Innovate x Excellence" maxLength={120} />
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea value={form.description} onChange={onChange("description")} required rows={5} className={`${INPUT} resize-none`} placeholder="What's this event about? Who should attend?" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={LABEL}>Start date</label><input type="date" value={form.date} onChange={onChange("date")} required className={INPUT} /></div>
            <div><label className={LABEL}>End date</label><input type="date" value={form.endDate} onChange={onChange("endDate")} className={INPUT} /></div>
            <div><label className={LABEL}>Registration deadline</label><input type="date" value={form.registrationDeadline} onChange={onChange("registrationDeadline")} className={INPUT} /></div>
            <div>
              <label className={LABEL}>Mode</label>
              <select value={form.mode} onChange={onChange("mode")} className={INPUT}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div><label className={LABEL}>Venue</label><input value={form.venue} onChange={onChange("venue")} required className={INPUT} placeholder="e.g. School of Engineering, FWU, Mahendranagar" /></div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={LABEL}>Cost</label><input value={form.cost} onChange={onChange("cost")} className={INPUT} placeholder="Free / Rs 2000/Team" /></div>
            <div><label className={LABEL}>Organizer name</label><input value={form.organizerName} onChange={onChange("organizerName")} className={INPUT} placeholder="e.g. ACIT Club" /></div>
          </div>

          <div><label className={LABEL}>Registration link</label><input type="url" value={form.registrationLink} onChange={onChange("registrationLink")} className={INPUT} placeholder="https://..." /></div>

          <div>
            <label className={LABEL}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                      active
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3">
            <Link to="/events" className="px-5 py-3 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors">Cancel</Link>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { y: -1 } : undefined}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-40 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : "Publish event"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}