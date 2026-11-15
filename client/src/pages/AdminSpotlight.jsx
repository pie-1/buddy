// client/src/pages/AdminSpotlight.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiXCircle, FiExternalLink, FiUsers } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import {
  fetchAdminClaims, verifyClaim, rejectClaim,
} from "../services/spotlightService";

const EASE = [0.22, 1, 0.36, 1];

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

export default function AdminSpotlight() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("pending");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminClaims({ status });
      setClaims(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const handleVerify = async (id) => {
    setBusyId(id);
    try {
      await verifyClaim(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (reason === null) return;
    setBusyId(id);
    try {
      await rejectClaim(id, reason);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not reject");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-5xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-purple-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2 flex items-center gap-2">
              <FiUsers size={12} /> Admin · Spotlight queue
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Verify payments</h1>
            <p className="text-stone-500 mt-1 text-sm">Match each claim against the eSewa statement before verifying.</p>
          </div>
          <Link to="/dashboard" className="shrink-0 text-sm font-semibold text-stone-600 hover:text-stone-900">
            ← Back to dashboard
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                status === f.value ? "bg-purple-600 text-white border-purple-600" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
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
            <FiLoader className="animate-spin text-purple-500" size={32} />
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
            <FiCheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-stone-600">No {status || ""} claims.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-white border border-stone-200 rounded-2xl p-5"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <a href={c.screenshot} target="_blank" rel="noreferrer" className="shrink-0">
                    <img src={c.screenshot} alt="Proof" className="w-32 h-32 object-cover rounded-xl border border-stone-200 hover:opacity-80 transition-opacity" />
                  </a>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 grid place-items-center text-white text-xs font-bold">
                        {c.userId?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-900">{c.userId?.name}</div>
                        <div className="text-[10px] text-stone-500">{c.userId?.university} · {c.userId?.college}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Txn ID</div>
                        <div className="font-mono text-stone-800">{c.txnId}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Amount</div>
                        <div className="text-stone-800 font-semibold">Rs. {c.amount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Week</div>
                        <div className="text-stone-800">
                          {new Date(c.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Status</div>
                        <div className={`font-semibold capitalize ${
                          c.status === "verified" ? "text-emerald-700"
                          : c.status === "rejected" ? "text-red-700"
                          : "text-amber-700"
                        }`}>{c.status}</div>
                      </div>
                    </div>

                    {c.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleVerify(c._id)}
                          disabled={busyId === c._id}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          {busyId === c._id ? <><FiLoader size={12} className="animate-spin" /> Verifying…</> : <><FiCheckCircle size={12} /> Verify</>}
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          disabled={busyId === c._id}
                          className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          <FiXCircle size={12} /> Reject
                        </button>
                        <a
                          href={c.screenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-lg"
                        >
                          <FiExternalLink size={12} /> Full view
                        </a>
                      </div>
                    )}

                    {c.status === "rejected" && c.rejectionReason && (
                      <div className="mt-3 text-xs text-red-600 italic">
                        Reason: {c.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}