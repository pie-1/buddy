// client/src/pages/RoommateDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Loader2, MapPin, Users, Home, Search, Calendar,
  Sparkles, AlertCircle, ShieldCheck, Moon, Sun, Pencil, Trash2, ExternalLink,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchRoommateById, deleteRoommate } from "../services/roommateService";
import { startConversation } from "../services/chatService";

const EASE = [0.22, 1, 0.36, 1];

const KIND_META = {
  "have-room": { icon: Home, label: "Has a room", cls: "text-orange-300 border-orange-500/30 bg-orange-500/10" },
  "looking-for-room": { icon: Search, label: "Looking for a room", cls: "text-indigo-300 border-indigo-500/30 bg-indigo-500/10" },
};

function ctaFor(viewerKind, posterKind) {
  if (viewerKind === "looking-for-room" && posterKind === "have-room") return "Request to join";
  if (viewerKind === "looking-for-room" && posterKind === "looking-for-room") return "Invite to co-search";
  if (viewerKind === "have-room" && posterKind === "looking-for-room") return "Invite to share";
  return "Chat";
}

export default function RoommateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchRoommateById(id);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load this profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleRequest = async () => {
    if (!user) return navigate("/auth", { state: { from: { pathname: `/roommates/${id}` } } });
    if (!listing || requesting) return;
    setRequesting(true);
    try {
      const convo = await startConversation({
        recipientId: listing.postedBy._id,
        contextType: "roommate",
        contextId: listing._id,
      });
      navigate(`/chat/${convo._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not open chat");
      setRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteRoommate(listing._id);
      navigate("/roommates");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this profile");
      setDeleting(false);
      setConfirmDelete(false);
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

  if (error || !listing) {
    return (
      <div data-nav-theme="dark" className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">Profile not found</h1>
          <p className="text-gray-400 mb-8">{error || "This profile may have been removed."}</p>
          <Link to="/roommates" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft size={16} /> Back to roommates
          </Link>
        </div>
      </div>
    );
  }

  const poster = listing.postedBy;
  const isOwner = user && poster && user._id === poster._id;
  const cover = listing.photos?.[0];
  const kind = KIND_META[listing.kind] || KIND_META["have-room"];
  const KindIcon = kind.icon;
  const viewerKind = "looking-for-room";
  const cta = ctaFor(viewerKind, listing.kind);

  const priceBlock = listing.kind === "have-room" ? (
    <>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Rent</div>
      <div className="text-4xl font-black text-white mb-6">
        Rs. {listing.rent?.toLocaleString()}<span className="text-sm text-gray-500">/mo</span>
      </div>
    </>
  ) : (
    <>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Budget</div>
      <div className="text-4xl font-black text-white mb-6">
        Rs. {listing.budgetMin?.toLocaleString() ?? "—"} – {listing.budgetMax?.toLocaleString() ?? "—"}
      </div>
    </>
  );

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,.15), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        <Link to="/roommates" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to roommates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="space-y-8">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10">
              {cover ? (
                <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10">
                  <KindIcon size={80} />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${kind.cls}`}>
                  <KindIcon size={10} /> {kind.label}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 backdrop-blur-md">
                  {listing.roomType}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 backdrop-blur-md">
                  {listing.genderPreference} ok
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.05] mb-4">{listing.title}</h1>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#14121f] border border-white/10 rounded-xl p-4">
                <MapPin size={16} className="text-orange-400 mb-2" />
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Area</div>
                <div className="text-white font-bold text-sm truncate">{listing.area}</div>
              </div>
              <div className="bg-[#14121f] border border-white/10 rounded-xl p-4">
                <Calendar size={16} className="text-indigo-400 mb-2" />
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Move-in</div>
                <div className="text-white font-bold text-sm">{new Date(listing.moveInDate).toLocaleDateString()}</div>
              </div>
              <div className="bg-[#14121f] border border-white/10 rounded-xl p-4">
                <Users size={16} className="text-cyan-400 mb-2" />
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Lease</div>
                <div className="text-white font-bold text-sm">{listing.leaseDuration}</div>
              </div>
              <div className="bg-[#14121f] border border-white/10 rounded-xl p-4">
                {listing.sleepSchedule === "night-owl" ? <Moon size={16} className="text-violet-400 mb-2" /> : <Sun size={16} className="text-amber-400 mb-2" />}
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Sleep</div>
                <div className="text-white font-bold text-sm capitalize">{listing.sleepSchedule?.replace("-", " ") || "—"}</div>
              </div>
            </div>

            {listing.amenities?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-lg">
                      <Sparkles size={11} /> {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {listing.location?.raw && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Location</h2>
                <a
                  href={listing.location.raw}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 bg-[#14121f] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 grid place-items-center shrink-0">
                      <MapPin size={20} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white">View on Google Maps</div>
                      <div className="text-xs text-gray-500">Opens the exact spot in a new tab</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                </a>
              </div>
            )}
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} className="space-y-5 lg:sticky lg:top-32 self-start">
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              {priceBlock}

              {isOwner ? (
                <div className="space-y-2">
                  <Link
                    to={`/roommates/${listing._id}/edit`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                  >
                    <Pencil size={16} /> Edit profile
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} /> Delete profile
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRequest}
                  disabled={requesting || listing.status !== "available"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-5 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(249,115,22,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {requesting ? <><Loader2 size={16} className="animate-spin" /> Opening chat…</> : <><MessageCircle size={16} /> {cta}</>}
                </button>
              )}
            </div>

            {poster && (
              <div className="bg-[#14121f] border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-500 mb-4">Posted by</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 grid place-items-center text-white font-bold text-lg shrink-0">
                    {poster.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">{poster.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><ShieldCheck size={11} /> {poster.university} Node</div>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center px-4" onClick={() => !deleting && setConfirmDelete(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#14121f] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">Delete this profile?</h3>
            <p className="text-gray-400 text-sm mb-6">This will remove the profile and any pending requests.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(false)} disabled={deleting} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}