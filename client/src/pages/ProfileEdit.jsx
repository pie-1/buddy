// client/src/pages/ProfileEdit.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft, FiLoader, FiUploadCloud, FiX, FiUser, FiPlus, FiCheckCircle
} from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchMyProfile, updateMyProfile } from "../services/userService";
import { uploadAvatar } from "../services/uploadService";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all text-sm disabled:opacity-60";
const LABEL = "block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2";

const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Electronics", "Electrical",
  "Mechanical", "Civil", "Architecture", "Business", "Design", "Other",
];

const STATUS_OPTIONS = [
  "Open to collaborate",
  "Looking for teammates",
  "Looking for roommates",
  "Open to internships",
  "Just here",
];

export default function ProfileEdit() {
  const { user: me, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMyProfile();
        setForm({
          name: data.name || "",
          avatar: data.avatar || null,
          bio: data.bio || "",
          department: data.department || "",
          college: data.college || "",
          company: data.company || "",
          lookingFor: data.lookingFor || "",
          currentProject: data.currentProject || "",
          graduationYear: data.graduationYear || new Date().getFullYear() + 1,
          socials: {
            linkedin: data.socials?.linkedin || "",
            github: data.socials?.github || "",
            portfolio: data.socials?.portfolio || "",
            twitter: data.socials?.twitter || "",
          },
        });
        setSkills(data.skills || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSocialChange = (k) => (e) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: e.target.value } }));

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val || skills.includes(val)) return;
    setSkills([...skills, val]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setUploadingAvatar(true);
    setError("");
    try {
      const url = await uploadAvatar(file);
      if (url) setForm((f) => ({ ...f, avatar: url }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (success) return; 

    setSaving(true);
    setError("");

    const gradYear = Number(form.graduationYear);
    if (!Number.isFinite(gradYear) || gradYear < 2015 || gradYear > 2035) {
      setError("Graduation year must be between 2015 and 2035.");
      setSaving(false);
      return;
    }

    // Build payload carefully
    const cleanSocials = Object.fromEntries(
      Object.entries(form.socials)
        .map(([k, v]) => [k, String(v ?? "").trim()])
        .filter(([, v]) => v.length > 0)
    );

    try {
      const payload = { ...form, graduationYear: gradYear, socials: cleanSocials, skills };
      
      // 1. Send to backend
      const updated = await updateMyProfile(payload);
      
      // 2. Update global React Context
      if (updateUser) {
        updateUser({ name: updated.name, avatar: updated.avatar });
      }
      
      // 3. Lock the UI and redirect
      setSuccess(true);
      setTimeout(() => navigate(`/profile/${me._id}`), 900);
      
    } catch (err) {
      console.error("CATCH BLOCK HIT:", err);
      // Show the specific backend error if it exists, otherwise show the generic one
      const data = err.response?.data;
      setError(data?.message || "Could not save profile changes.");
      setSaving(false);
    }
  };

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

  if (!form) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-md mx-auto pt-32 px-6 text-center">
          <p className="text-stone-500 mb-6">{error || "Could not load profile."}</p>
          <Link to="/profile/me" className="text-sm font-semibold text-orange-700 hover:underline">
            ← Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to={`/profile/${me._id}`} className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6 font-medium">
          <FiArrowLeft size={16} /> Back to profile
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <p className="text-orange-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-2">Edit profile</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            Make it <span className="italic text-orange-700">yours.</span>
          </h1>
          <p className="text-stone-500 mt-2">The more you fill in, the easier it is for others to find and trust you.</p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
        >
          {/* Avatar */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2 mb-4">Photo</h2>
            <div className="flex items-center gap-4">
              {form.avatar ? (
                <div className="relative">
                  <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-sm" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, avatar: null }))}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-500 transition-colors shadow-sm"
                    aria-label="Remove avatar"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 grid place-items-center text-stone-300 shadow-sm">
                  <FiUser size={28} />
                </div>
              )}

              <label className={`cursor-pointer inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm ${success ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploadingAvatar ? (
                  <><FiLoader size={14} className="animate-spin" /> Uploading…</>
                ) : (
                  <><FiUploadCloud size={14} /> Upload photo</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                  disabled={uploadingAvatar || success}
                />
              </label>
            </div>
          </div>

          {/* Basics */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">Basics</h2>

            <div>
              <label className={LABEL}>Full name</label>
              <input value={form.name} onChange={onChange("name")} required className={INPUT} maxLength={60} disabled={success} />
            </div>

            <div>
              <label className={LABEL}>Bio</label>
              <textarea value={form.bio} onChange={onChange("bio")} rows={4} className={`${INPUT} resize-none`} maxLength={500} placeholder="What are you into? What do you want to build? Any interests someone should know about." disabled={success} />
              <p className="text-[10px] text-stone-400 mt-1 text-right font-medium">{form.bio.length}/500</p>
            </div>

            <div>
              <label className={LABEL}>Currently working on</label>
              <input value={form.currentProject} onChange={onChange("currentProject")} className={INPUT} maxLength={200} placeholder="e.g. Building a campus marketplace app, learning Rust…" disabled={success} />
            </div>

            <div>
              <label className={LABEL}>Status</label>
              <select value={form.lookingFor} onChange={onChange("lookingFor")} className={INPUT} disabled={success}>
                <option value="">Choose a status (optional)</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">Education</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>College</label>
                <input value={form.college} onChange={onChange("college")} className={INPUT} placeholder="e.g. ACME Engineering College" maxLength={120} disabled={success} />
              </div>
              <div>
                <label className={LABEL}>Department</label>
                <select value={form.department} onChange={onChange("department")} className={INPUT} disabled={success}>
                  <option value="">Select…</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Graduation year</label>
                <input
                  type="number"
                  min={2015}
                  max={2035}
                  value={form.graduationYear ?? ""}
                  onChange={onChange("graduationYear")}
                  className={INPUT}
                  placeholder="e.g. 2027"
                  disabled={success}
                />
              </div>
              <div>
                <label className={LABEL}>Working at (if alumni)</label>
                <input value={form.company} onChange={onChange("company")} className={INPUT} placeholder="e.g. Software Engineer at Fusemachines" maxLength={120} disabled={success} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">Skills</h2>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                }}
                placeholder="e.g. React, Figma, Public speaking"
                className={INPUT}
                maxLength={30}
                disabled={success}
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim() || success}
                className="shrink-0 inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FiPlus size={14} /> Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {s}
                    {!success && (
                      <button type="button" onClick={() => removeSkill(s)} className="text-stone-400 hover:text-red-600 transition-colors">
                        <FiX size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Socials */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2">Links</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>GitHub</label>
                <input value={form.socials.github} onChange={onSocialChange("github")} className={INPUT} placeholder="username or full URL" disabled={success} />
              </div>
              <div>
                <label className={LABEL}>LinkedIn</label>
                <input value={form.socials.linkedin} onChange={onSocialChange("linkedin")} className={INPUT} placeholder="username or full URL" disabled={success} />
              </div>
              <div>
                <label className={LABEL}>Portfolio</label>
                <input value={form.socials.portfolio} onChange={onSocialChange("portfolio")} className={INPUT} placeholder="https://..." disabled={success} />
              </div>
              <div>
                <label className={LABEL}>X (Twitter)</label>
                <input value={form.socials.twitter} onChange={onSocialChange("twitter")} className={INPUT} placeholder="username or full URL" disabled={success} />
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <FiCheckCircle size={16} /> Saved successfully. Redirecting…
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <Link to={`/profile/${me._id}`} className={`px-5 py-3 text-sm font-semibold transition-colors ${success ? 'text-stone-400 pointer-events-none' : 'text-stone-500 hover:text-stone-900'}`}>
              Cancel
            </Link>
            <motion.button
              type="submit"
              disabled={saving || uploadingAvatar || success}
              whileHover={!saving && !success ? { y: -1 } : undefined}
              className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm ${
                success 
                  ? 'bg-emerald-600 cursor-default' 
                  : 'bg-stone-900 hover:bg-stone-800 disabled:opacity-40'
              }`}
            >
              {saving ? (
                <><FiLoader size={14} className="animate-spin" /> Saving…</>
              ) : success ? (
                <><FiCheckCircle size={14} /> Saved</>
              ) : (
                "Save changes"
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}