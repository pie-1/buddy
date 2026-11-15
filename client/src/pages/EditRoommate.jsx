// client/src/pages/EditRoommate.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchRoommateById, updateRoommate } from "../services/roommateService";
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
const STATUSES = ["available", "filled", "hidden"];

export default function EditRoommate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, raw: "" });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRoommateById(id);
        if (user && data.postedBy?._id !== user._id) {
          setError("You can only edit your own profile.");
          setLoading(false);
          return;
        }
        setForm({
          kind: data.kind,
          title: data.title,
          description: data.description,
          rent: data.rent ?? "",
          area: data.area,
          roomType: data.roomType,
          genderPreference: data.genderPreference,
          furnishing: data.furnishing,
          amenities: (data.amenities || []).join(", "),
          budgetMin: data.budgetMin ?? "",
          budgetMax: data.budgetMax ?? "",
          preferredAreas: (data.preferredAreas || []).join(", "),
          sleepSchedule: data.sleepSchedule,
          cleanliness: data.cleanliness,
          moveInDate: data.moveInDate?.slice(0, 10) || "",
          leaseDuration: data.leaseDuration,
          status: data.status,
        });
        setLocation(data.location || { lat: null, lng: null, raw: "" });
        setFiles((data.photos || []).map((url) => ({ url, thumb: url, isPdf: url.endsWith(".pdf") })));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        rent: form.kind === "have-room" ? Number(form.rent) : 0,
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
        status: form.status,
      };
      await updateRoommate(id, payload);
      navigate(`/roommates/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div data-nav-theme="dark" className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-32 px-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div data-nav-theme="dark" className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <h1 className="text-2xl font-serif font-bold mb-2">Cannot edit this profile</h1>
          <p className="text-gray-400 mb-8">{error || "This profile does not belong to you."}</p>
          <Link to="/roommates" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Back to roommates
          </Link>
        </div>
      </div>
    );
  }

  const isHave = form.kind === "have-room";

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <div className="relative max-w-4xl mx-auto pt-32 pb-24 px-6">
        <Link to={`/roommates/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to profile
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-10">
          <p className="text-orange-400 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">Edit profile</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.05]">
            Update your
            <span className="italic text-orange-400"> details.</span>
          </h1>
        </motion.div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} className="bg-[#14121f]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
          {isHave && (
            <section>
              <h2 className="text-xl font-bold mb-3">Photos</h2>
              <ImageDropzone files={files} onChange={setFiles} max={4} />
            </section>
          )}

          <section className="space-y-5">
            <h2 className="text-xl font-bold">Basics</h2>
            <div>
              <label className={LABEL}>Headline</label>
              <input value={form.title} onChange={onChange("title")} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>About</label>
              <textarea value={form.description} onChange={onChange("description")} rows={4} className={`${INPUT} resize-none`} />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-xl font-bold">{isHave ? "Room details" : "Looking for"}</h2>
            {isHave ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Monthly rent</label>
                  <input type="number" min={0} value={form.rent} onChange={onChange("rent")} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Area</label>
                  <input value={form.area} onChange={onChange("area")} className={INPUT} />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Budget min</label>
                  <input type="number" min={0} value={form.budgetMin} onChange={onChange("budgetMin")} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Budget max</label>
                  <input type="number" min={0} value={form.budgetMax} onChange={onChange("budgetMax")} className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Preferred areas</label>
                  <input value={form.preferredAreas} onChange={onChange("preferredAreas")} className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Primary area</label>
                  <input value={form.area} onChange={onChange("area")} className={INPUT} />
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Move-in date</label>
                <input type="date" value={form.moveInDate} onChange={onChange("moveInDate")} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Lease duration</label>
                <input value={form.leaseDuration} onChange={onChange("leaseDuration")} className={INPUT} />
              </div>
            </div>
            {isHave && (
              <div>
                <label className={LABEL}>Amenities</label>
                <input value={form.amenities} onChange={onChange("amenities")} className={INPUT} />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-orange-400" /> Map location
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

          <section>
            <h2 className="text-xl font-bold mb-3">Status</h2>
            <select value={form.status} onChange={onChange("status")} className={INPUT}>
              {STATUSES.map((s) => <option key={s} value={s} className="bg-[#14121f] capitalize">{s}</option>)}
            </select>
          </section>

          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <Link to={`/roommates/${id}`} className="px-5 py-3 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors">Cancel</Link>
            <motion.button type="submit" disabled={saving} whileHover={!saving ? { y: -1 } : undefined} className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_24px_rgba(249,115,22,0.35)] disabled:opacity-40">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save changes"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}