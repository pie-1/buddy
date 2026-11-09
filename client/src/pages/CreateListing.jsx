// client/src/pages/CreateListing.jsx
import { useContext, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { createListing } from "../services/listingService";
import ImageDropzone from "../components/features/Marketplace/ImageDropzone";
import ListingPreviewCard from "../components/features/Marketplace/ListingPreviewCard";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all";
const LABEL = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2";

const CATEGORIES = [
  { value: "sell", label: "Sell", emoji: "🛍️", desc: "Hand over, get paid.", gradient: "from-indigo-500/20 to-purple-500/10" },
  { value: "rent", label: "Rent", emoji: "🔁", desc: "Lend it out, get it back.", gradient: "from-orange-500/20 to-amber-500/10" },
  { value: "borrow", label: "Borrow", emoji: "🤝", desc: "Looking to borrow something.", gradient: "from-emerald-500/20 to-teal-500/10" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export default function CreateListing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "sell",
    price: "",
    rentPeriod: "day",
    condition: "good",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const needsPeriod = form.category === "rent" || form.category === "borrow";

  const canSubmit = useMemo(
    () => form.title.trim().length >= 3 && form.description.trim().length >= 10 && form.price !== "" && Number(form.price) >= 0,
    [form]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        condition: form.condition,
        rentPeriod: needsPeriod ? form.rentPeriod : null,
        images, // Already Cloudinary URLs from the dropzone
      };

      const created = await createListing(payload);
      navigate(`/marketplace/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
      setSubmitting(false);
    }
  };

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,.2), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to marketplace
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-10">
          <p className="text-indigo-400 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">New listing</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.05]">
            Tell campus what
            <span className="italic text-indigo-400"> you've got.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="bg-[#14121f]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-8"
          >
            {/* Photos */}
            <section>
              <h2 className="text-xl font-bold mb-1">Photos</h2>
              <p className="text-sm text-gray-400 mb-4">First photo becomes the cover. Images are auto-compressed.</p>
              <ImageDropzone images={images} onChange={setImages} max={4} />
            </section>

            {/* Basics */}
            <section className="space-y-5">
              <h2 className="text-xl font-bold mb-1">Basics</h2>

              <div>
                <label className={LABEL}>Title</label>
                <input value={form.title} onChange={onChange("title")} className={INPUT} placeholder="e.g. HC Verma Vol 1 — barely used" maxLength={80} />
                <p className="mt-1 text-[11px] text-gray-500">{form.title.length}/80</p>
              </div>

              <div>
                <label className={LABEL}>Description</label>
                <textarea value={form.description} onChange={onChange("description")} rows={5} className={`${INPUT} resize-none`} placeholder="Condition, why you're selling, pickup location, anything else a buyer should know." maxLength={500} />
                <p className="mt-1 text-[11px] text-gray-500">{form.description.length}/500</p>
              </div>

              <div>
                <label className={LABEL}>Condition</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, condition: c.value }))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        form.condition === c.value
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_16px_rgba(79,70,229,0.4)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Intent with Visual Identity */}
            <section>
              <h2 className="text-xl font-bold mb-1">What are you doing?</h2>
              <p className="text-sm text-gray-400 mb-4">This decides the fields below.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: c.value }))}
                    className={`relative text-left p-4 rounded-xl border transition-all overflow-hidden ${
                      form.category === c.value
                        ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.25)]"
                        : "bg-white/[0.03] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 transition-opacity ${form.category === c.value ? "opacity-100" : "group-hover:opacity-50"}`} />
                    <div className="relative">
                      <div className="text-3xl mb-2">{c.emoji}</div>
                      <div className="font-bold text-white mb-1">{c.label}</div>
                      <div className="text-xs text-gray-400 leading-relaxed">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-5">
              <h2 className="text-xl font-bold mb-1">Pricing</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Price (Rs.)</label>
                  <input type="number" min={0} value={form.price} onChange={onChange("price")} className={INPUT} placeholder="350" />
                </div>
                <AnimatePresence>
                  {needsPeriod && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <label className={LABEL}>Per</label>
                      <select value={form.rentPeriod} onChange={onChange("rentPeriod")} className={`${INPUT} cursor-pointer`}>
                        <option value="day" className="bg-[#14121f]">Day</option>
                        <option value="week" className="bg-[#14121f]">Week</option>
                        <option value="month" className="bg-[#14121f]">Month</option>
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 pt-2">
              <Link to="/marketplace" className="px-5 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors">
                Cancel
              </Link>
              <motion.button
                type="submit"
                disabled={!canSubmit || submitting}
                whileHover={canSubmit && !submitting ? { y: -1 } : undefined}
                whileTap={{ scale: 0.985 }}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_24px_rgba(79,70,229,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (<><Loader2 size={16} className="animate-spin" /> Publishing…</>) : (<>Publish listing</>)}
              </motion.button>
            </div>
          </motion.form>

          {/* Preview */}
          <div>
            <ListingPreviewCard form={form} images={images} sellerName={user?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}