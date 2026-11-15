// client/src/pages/CreateRoommate.jsx
import { useContext, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Home, Search, MapPin } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { createRoommate } from "../services/roommateService";
import ImageDropzone from "../components/features/Marketplace/ImageDropzone";
import MapLocationInput from "../components/features/Roommates/MapLocationInput";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all";
const LABEL = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2";

const GENDERS = ["any", "male", "female"];
const ROOM_TYPES = ["single", "shared", "entire-flat"];
const FURNISHING = ["unfurnished", "semi-furnished", "furnished"];
const SLEEP = ["flexible", "early-bird", "night-owl"];
const CLEANLINESS = ["average", "very-clean", "relaxed"];

export default function CreateRoommate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [kind, setKind] = useState("looking-for-room");
  const [form, setForm] = useState({
    title: "", description: "",
    rent: "", area: "", roomType: "single", genderPreference: "any",
    furnishing: "unfurnished", amenities: "",
    budgetMin: "", budgetMax: "", preferredAreas: "",
    sleepSchedule: "flexible", cleanliness: "average",
    moveInDate: "", leaseDuration: "flexible",
  });
  const [location, setLocation] = useState({ lat: null, lng: null, raw: "" });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = useMemo(
    () => form.title.trim().length >= 3 && form.description.trim().length >= 10 &&
          form.area.trim() && form.moveInDate &&
          (kind === "have-room" ? form.rent !== "" : true),
    [form, kind]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        kind,
        title: form.title.trim(),
        description: form.description.trim(),
        rent: kind === "have-room" ? Number(form.rent) : 0,
        area: form.area.trim(),
        location,
        roomType: form.roomType,
        genderPreference: form.genderPreference,
        furnishing: form.furnishing,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        preferredAreas: form.preferredAreas.split(",").map((s) => s.trim()).filter(Boolean),
        sleepSchedule: form.sleepSchedule,
        cleanliness: form.cleanliness,
        moveInDate: form.moveInDate,
        leaseDuration: form.leaseDuration,
        photos: files.map((f) => f.url),
      };
      const created = await createRoommate(payload);
      navigate(`/roommates/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create profile");
      setSubmitting(false);
    }
  };

  const isHave = kind === "have-room";

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,.15), transparent 65%)" }} />

      <div className="relative max-w-4xl mx-auto pt-32 pb-24 px-6">
        <Link to="/roommates" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to roommates
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-10">
          <p className="text-orange-400 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">New profile</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.05]">
            Tell campus who
            <span className="italic text-orange-400"> you are.</span>
          </h1>
        </motion.div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} className="bg-[#14121f]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">

          <section>
            <h2 className="text-xl font-bold mb-4">Which describes you?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button" onClick={() => setKind("looking-for-room")}
                className={`text-left p-4 rounded-xl border transition-all ${kind === "looking-for-room" ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.2)]" : "bg-white/[0.03] border-white/10 hover:border-white/20"}`}
              >
                <Search size={18} className={kind === "looking-for-room" ? "text-indigo-400 mb-2" : "text-gray-400 mb-2"} />
                <div className="font-bold text-white mb-1">I'm looking for a room</div>
                <div className="text-xs text-gray-400">I don't have a flat yet.</div>
              </button>
              <button
                type="button" onClick={() => setKind("have-room")}
                className={`text-left p-4 rounded-xl border transition-all ${kind === "have-room" ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]" : "bg-white/[0.03] border-white/10 hover:border-white/20"}`}
              >
                <Home size={18} className={kind === "have-room" ? "text-orange-400 mb-2" : "text-gray-400 mb-2"} />
                <div className="font-bold text-white mb-1">I have a room</div>
                <div className="text-xs text-gray-400">I need a flatmate to share.</div>
              </button>
            </div>
          </section>

          {isHave && (
            <section>
              <h2 className="text-xl font-bold mb-3">Photos of the room</h2>
              <ImageDropzone files={files} onChange={setFiles} max={4} />
            </section>
          )}

          <section className="space-y-5">
            <h2 className="text-xl font-bold">Basics</h2>
            <div>
              <label className={LABEL}>Headline</label>
              <input value={form.title} onChange={onChange("title")} className={INPUT} placeholder={isHave ? "e.g. Single room near ACME, looking for flatmate" : "e.g. New student looking for a room near Biratnagar"} maxLength={80} />
            </div>
            <div>
              <label className={LABEL}>About</label>
              <textarea value={form.description} onChange={onChange("description")} rows={4} className={`${INPUT} resize-none`} placeholder={isHave ? "Describe the flat, house rules, who you're looking for." : "Tell potential flatmates about yourself."} maxLength={500} />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-xl font-bold">{isHave ? "Room details" : "What you're looking for"}</h2>
            {isHave ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Monthly rent (Rs.)</label>
                  <input type="number" min={0} value={form.rent} onChange={onChange("rent")} className={INPUT} placeholder="8000" />
                </div>
                <div>
                  <label className={LABEL}>Area / neighborhood</label>
                  <input value={form.area} onChange={onChange("area")} className={INPUT} placeholder="Biratnagar Ward 5" />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Budget min (Rs.)</label>
                  <input type="number" min={0} value={form.budgetMin} onChange={onChange("budgetMin")} className={INPUT} placeholder="3000" />
                </div>
                <div>
                  <label className={LABEL}>Budget max (Rs.)</label>
                  <input type="number" min={0} value={form.budgetMax} onChange={onChange("budgetMax")} className={INPUT} placeholder="10000" />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Preferred areas (comma separated)</label>
                  <input value={form.preferredAreas} onChange={onChange("preferredAreas")} className={INPUT} placeholder="Biratnagar, Tankisinuwari" />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Preferred area (primary)</label>
                  <input value={form.area} onChange={onChange("area")} className={INPUT} placeholder="Biratnagar" />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Room type</label>
                <select value={form.roomType} onChange={onChange("roomType")} className={INPUT}>
                  {ROOM_TYPES.map((t) => <option key={t} value={t} className="bg-[#14121f] capitalize">{t.replace("-", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Gender preference</label>
                <select value={form.genderPreference} onChange={onChange("genderPreference")} className={INPUT}>
                  {GENDERS.map((g) => <option key={g} value={g} className="bg-[#14121f] capitalize">{g}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Furnishing</label>
                <select value={form.furnishing} onChange={onChange("furnishing")} className={INPUT}>
                  {FURNISHING.map((f) => <option key={f} value={f} className="bg-[#14121f] capitalize">{f.replace("-", " ")}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Move-in date</label>
                <input type="date" value={form.moveInDate} onChange={onChange("moveInDate")} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Lease duration</label>
                <input value={form.leaseDuration} onChange={onChange("leaseDuration")} className={INPUT} placeholder="6 months, flexible" />
              </div>
            </div>

            {isHave && (
              <div>
                <label className={LABEL}>Amenities (comma separated)</label>
                <input value={form.amenities} onChange={onChange("amenities")} className={INPUT} placeholder="wifi, water, parking, laundry" />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-orange-400" /> Map location (optional)
            </h2>
            <MapLocationInput value={location} onChange={setLocation} />
          </section>

          <section className="space-y-5">
            <h2 className="text-xl font-bold">Habits</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Sleep schedule</label>
                <select value={form.sleepSchedule} onChange={onChange("sleepSchedule")} className={INPUT}>
                  {SLEEP.map((s) => <option key={s} value={s} className="bg-[#14121f] capitalize">{s.replace("-", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Cleanliness</label>
                <select value={form.cleanliness} onChange={onChange("cleanliness")} className={INPUT}>
                  {CLEANLINESS.map((c) => <option key={c} value={c} className="bg-[#14121f] capitalize">{c.replace("-", " ")}</option>)}
                </select>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3">
            <Link to="/roommates" className="px-5 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors">Cancel</Link>
            <motion.button
              type="submit"
              disabled={!canSubmit || submitting}
              whileHover={canSubmit && !submitting ? { y: -1 } : undefined}
              whileTap={{ scale: 0.985 }}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_24px_rgba(249,115,22,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : "Publish profile"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}