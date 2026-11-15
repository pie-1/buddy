// client/src/pages/SpotlightClaim.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLoader, FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { submitSpotlightClaim } from "../services/spotlightService";
import { uploadFiles } from "../services/uploadService";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-sm";
const LABEL = "block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2";

export default function SpotlightClaim() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const results = await uploadFiles([file]);
      setScreenshot(results[0]?.url || null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!txnId.trim() || !screenshot) {
      setError("Transaction ID and screenshot are both required");
      return;
    }
    setSubmitting(true);
    try {
      await submitSpotlightClaim({ txnId: txnId.trim(), screenshot });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit claim");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-md mx-auto pt-32 px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 mb-6">
            <FiCheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Claim submitted</h1>
          <p className="text-stone-500 mb-8">
            The club will verify your payment against the eSewa statement and assign your slot shortly.
          </p>
          <Link to="/spotlight" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl">
            Back to spotlight
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to="/spotlight" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6">
          <FiArrowLeft size={16} /> Back to spotlight
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <p className="text-purple-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">Claim your slot</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            Rs. 50 · <span className="italic text-purple-700">one week on top.</span>
          </h1>
        </motion.div>

        {/* Payment instructions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2 mb-4">Step 1 — Pay Rs. 50</h2>
          <p className="text-sm text-stone-600 mb-4">Send Rs. 50 via eSewa to the club's account:</p>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
            <div className="text-[10px] uppercase tracking-widest text-purple-600 font-bold mb-1">eSewa ID</div>
            <div className="font-mono text-lg font-bold text-purple-900">9800000000</div>
            <div className="text-xs text-purple-700 mt-1">ACIT Research Chair</div>
          </div>
          <p className="text-xs text-stone-500">
            After paying, note your <strong>transaction ID</strong> and take a screenshot. You'll upload both below.
          </p>
        </motion.div>

        {/* Claim form */}
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">Step 2 — Submit proof</h2>

          <div>
            <label className={LABEL}>eSewa transaction ID</label>
            <input value={txnId} onChange={(e) => setTxnId(e.target.value)} required className={INPUT} placeholder="e.g. 0ABC123DEF" maxLength={60} />
          </div>

          <div>
            <label className={LABEL}>Payment screenshot</label>
            {screenshot ? (
              <div className="relative inline-block">
                <img src={screenshot} alt="Payment proof" className="w-40 rounded-xl border border-stone-200" />
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-500"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-purple-400 rounded-xl py-8 px-4 text-center transition-colors">
                {uploading ? (
                  <><FiLoader size={24} className="animate-spin text-purple-500 mb-2" /><span className="text-sm text-stone-500">Uploading…</span></>
                ) : (
                  <><FiUploadCloud size={24} className="text-stone-400 mb-2" /><span className="text-sm text-stone-500">Click to upload screenshot</span><span className="text-xs text-stone-400 mt-1">PNG, JPG · max 5MB</span></>
                )}
                <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} disabled={uploading} />
              </label>
            )}
          </div>

          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
            <Link to="/spotlight" className="px-5 py-3 text-sm font-semibold text-stone-500 hover:text-stone-900">Cancel</Link>
            <motion.button type="submit" disabled={submitting || uploading} whileHover={!submitting ? { y: -1 } : undefined} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-40 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.5)]">
              {submitting ? <><FiLoader size={14} className="animate-spin" /> Submitting…</> : "Submit claim"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}