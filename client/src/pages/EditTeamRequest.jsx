// client/src/pages/EditTeamRequest.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import {
  fetchTeamRequestById,
  updateTeamRequest,
  deleteTeamRequest,
} from "../services/teamRequestService";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all text-sm";
const LABEL = "block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2";

const ROLE_PRESETS = ["Frontend dev", "Backend dev", "Designer", "Content writer", "Researcher", "Pitcher"];

const DEPARTMENTS = [
  "Any", "Computer Science", "Information Technology", "Electronics",
  "Electrical", "Mechanical", "Civil", "Architecture", "Business", "Design", "Other",
];

const STATUSES = ["open", "filled", "closed"];

export default function EditTeamRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [customRole, setCustomRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTeamRequestById(id);
        if (user && data.posterId?._id !== user._id) {
          setError("You can only edit your own team request.");
          setLoading(false);
          return;
        }
        setForm({
          teamName: data.teamName,
          pitch: data.pitch,
          department: data.department || "Any",
          rolesNeeded: data.rolesNeeded || [],
          skillTags: (data.skillTags || []).join(", "),
          spotsAvailable: data.spotsAvailable,
          contactPreference: data.contactPreference || "in-app chat",
          status: data.status,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleRole = (r) =>
    setForm((f) => ({
      ...f,
      rolesNeeded: f.rolesNeeded.includes(r)
        ? f.rolesNeeded.filter((x) => x !== r)
        : [...f.rolesNeeded, r],
    }));

  const addCustomRole = () => {
    const val = customRole.trim();
    if (!val || form.rolesNeeded.includes(val)) return;
    setForm((f) => ({ ...f, rolesNeeded: [...f.rolesNeeded, val] }));
    setCustomRole("");
  };

  const removeRole = (r) =>
    setForm((f) => ({ ...f, rolesNeeded: f.rolesNeeded.filter((x) => x !== r) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        skillTags: form.skillTags.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await updateTeamRequest(id, payload);
      navigate(`/team-requests/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this team request? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteTeamRequest(id);
      navigate(`/events/${form._eventId || ""}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <h1 className="text-2xl font-serif font-bold mb-2 text-stone-900">Cannot edit this request</h1>
          <p className="text-stone-500 mb-8">{error}</p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link
          to={`/team-requests/${id}`}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to request
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <p className="text-indigo-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">
            Edit request
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
            Update your <span className="italic text-indigo-700">team request.</span>
          </h1>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">
              Basics
            </h2>

            <div>
              <label className={LABEL}>Team name</label>
              <input value={form.teamName} onChange={onChange("teamName")} required className={INPUT} />
            </div>

            <div>
              <label className={LABEL}>Pitch</label>
              <textarea
                value={form.pitch}
                onChange={onChange("pitch")}
                required
                rows={5}
                className={`${INPUT} resize-none`}
              />
            </div>

            <div>
              <label className={LABEL}>Department</label>
              <select value={form.department} onChange={onChange("department")} className={INPUT}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d === "Any" ? "Open to any department" : d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">
              Roles needed
            </h2>

            <div>
              <label className={LABEL}>Presets</label>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.map((r) => {
                  const active = form.rolesNeeded.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRole(r)}
                      className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {active ? "✓ " : ""}{r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={LABEL}>Add a custom role</label>
              <div className="flex gap-2">
                <input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomRole();
                    }
                  }}
                  placeholder="e.g. ML engineer"
                  className={INPUT}
                  maxLength={40}
                />
                <button
                  type="button"
                  onClick={addCustomRole}
                  disabled={!customRole.trim()}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 rounded-xl disabled:opacity-30"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {form.rolesNeeded.length > 0 && (
              <div>
                <label className={LABEL}>Selected ({form.rolesNeeded.length})</label>
                <div className="flex flex-wrap gap-2">
                  {form.rolesNeeded.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200"
                    >
                      {r}
                      <button type="button" onClick={() => removeRole(r)} className="text-indigo-500 hover:text-indigo-900">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">
              Details
            </h2>

            <div>
              <label className={LABEL}>Skill tags</label>
              <input value={form.skillTags} onChange={onChange("skillTags")} className={INPUT} placeholder="React, Node, Figma" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Spots available</label>
                <input type="number" min={1} max={10} value={form.spotsAvailable} onChange={onChange("spotsAvailable")} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Contact preference</label>
                <select value={form.contactPreference} onChange={onChange("contactPreference")} className={INPUT}>
                  <option value="in-app chat">In-app chat</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL}>Status</label>
              <select value={form.status} onChange={onChange("status")} className={INPUT}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center gap-3 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete request"}
            </button>
            <div className="flex gap-3">
              <Link to={`/team-requests/${id}`} className="px-5 py-3 text-sm font-semibold text-stone-500 hover:text-stone-900">
                Cancel
              </Link>
              <motion.button
                type="submit"
                disabled={saving || form.rolesNeeded.length === 0}
                whileHover={!saving ? { y: -1 } : undefined}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-40"
              >
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save changes"}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}