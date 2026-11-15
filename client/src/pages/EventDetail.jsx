// client/src/pages/EventDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, Users, Ticket, Loader2, ExternalLink,
  CalendarPlus, AlertCircle, Pencil, Trash2, Check, ArrowUpRight, Sparkles,
  Users as UsersIcon,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchEventById, rsvpEvent, deleteEvent, fetchEvents } from "../services/eventService";
import { fetchTeamRequestsForEvent } from "../services/teamRequestService";
import TeamRequestCard from "../components/features/Events/TeamRequestCard";

const EASE = [0.22, 1, 0.36, 1];

const TAG_STYLES = {
  Tech: "bg-sky-100 text-sky-800 border-sky-200",
  AI: "bg-violet-100 text-violet-800 border-violet-200",
  Health: "bg-rose-100 text-rose-800 border-rose-200",
  Education: "bg-amber-100 text-amber-800 border-amber-200",
  Environment: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cybersecurity: "bg-blue-100 text-blue-800 border-blue-200",
  Business: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Community: "bg-orange-100 text-orange-800 border-orange-200",
  Engineering: "bg-slate-100 text-slate-800 border-slate-200",
  Sports: "bg-green-100 text-green-800 border-green-200",
};

const MODE_LABEL = { offline: "Offline", online: "Online", hybrid: "Hybrid" };
const daysUntil = (d) => (d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null);

function toICS(event) {
  const dt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = event.endDate || new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `UID:${event._id}@collegebuddy`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(event.date)}`, `DTEND:${dt(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.venue}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

function MetaItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 grid place-items-center shrink-0">
        <Icon size={15} className="text-stone-500" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-0.5">{label}</div>
        <div className="text-sm text-stone-900 font-medium">{children}</div>
      </div>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvp, setRsvp] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchEventById(id);
        if (cancelled) return;
        setEvent(data);

        const mine = data.rsvps?.find(
          (r) => r.userId?._id === user?._id || r.userId === user?._id
        );
        setRsvp(mine?.status || null);

        // Related events by primary tag
        if (data.tags?.length) {
          const all = await fetchEvents({ tag: data.tags[0] });
          if (!cancelled) setRelated((all || []).filter((e) => e._id !== data._id).slice(0, 3));
        }

        // Team requests linked to this event
        const trs = await fetchTeamRequestsForEvent(id);
        if (!cancelled) setTeamRequests(trs || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load this event");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, user?._id]);

  const handleRSVP = async (status) => {
    if (!user) return navigate("/auth", { state: { from: { pathname: `/events/${id}` } } });
    if (busy) return;
    setBusy(true);
    try {
      const res = await rsvpEvent(id, status);
      setRsvp(res.rsvp);
      const updated = await fetchEventById(id);
      setEvent(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Could not RSVP");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(id);
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const downloadICS = () => {
    const blob = new Blob([toICS(event)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-200 mb-6">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2 text-stone-900">Event not found</h1>
          <p className="text-stone-500 mb-8">{error || "This event may have been removed."}</p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && event.organizerId?._id === user._id;
  const deadlineDays = daysUntil(event.registrationDeadline);
  const isEnded = deadlineDays !== null && deadlineDays < 0;
  const goingCount = event.rsvps?.filter((r) => r.status === "going").length || 0;
  const interestedCount = event.rsvps?.filter((r) => r.status === "interested").length || 0;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6">
          <ArrowLeft size={16} /> All events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-6"
          >
            {/* Banner */}
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              {event.coverImage ? (
                <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <Calendar size={80} />
                </div>
              )}
              {isEnded && (
                <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Registration ended
                </div>
              )}
              {!isEnded && deadlineDays !== null && deadlineDays <= 3 && (
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {deadlineDays === 0 ? "Closes today" : `${deadlineDays} day${deadlineDays > 1 ? "s" : ""} left`}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${TAG_STYLES[tag] || "bg-stone-100 text-stone-700 border-stone-200"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-6 text-stone-900">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 pb-6 border-b border-stone-100">
                <MetaItem icon={Calendar} label="Event date">
                  {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {event.endDate && ` → ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                </MetaItem>
                {event.registrationDeadline && (
                  <MetaItem icon={Calendar} label="Registration ends">
                    {new Date(event.registrationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </MetaItem>
                )}
                <MetaItem icon={MapPin} label="Location">{event.venue}</MetaItem>
                <MetaItem icon={Users} label="Mode">{MODE_LABEL[event.mode]}</MetaItem>
                <MetaItem icon={Ticket} label="Cost">{event.cost}</MetaItem>
                {event.organizerName && <MetaItem icon={Users} label="Organizer">{event.organizerName}</MetaItem>}
              </div>

              <p className="text-stone-700 leading-relaxed whitespace-pre-line mb-8">{event.description}</p>

              <div className="flex flex-wrap gap-3">
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
                  >
                    <ExternalLink size={16} /> Register
                  </a>
                )}
                <button
                  onClick={downloadICS}
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-900 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                >
                  <CalendarPlus size={16} /> Add to calendar
                </button>
                {isOwner && (
                  <>
                    <Link
                      to={`/events/${event._id}/edit`}
                      className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Team Requests Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                    <UsersIcon size={18} className="text-indigo-600" /> Looking for teammates
                    {teamRequests.length > 0 && (
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {teamRequests.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Join an existing team or post your own
                  </p>
                </div>
                <Link
                  to={`/events/${event._id}/team/new`}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Post a request
                </Link>
              </div>

              {teamRequests.length === 0 ? (
                <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-6 text-center">
                  <p className="text-sm text-stone-600 mb-3">No team requests yet.</p>
                  <Link
                    to={`/events/${event._id}/team/new`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                  >
                    Be the first to post one →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamRequests.map((tr, i) => (
                    <TeamRequestCard key={tr._id} tr={tr} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right column */}
          <aside className="space-y-5 lg:sticky lg:top-32 self-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-stone-400 mb-4 inline-flex items-center gap-2">
                <Sparkles size={11} /> Who's going
              </p>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  {event.rsvps?.slice(0, 4).map((r, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-orange-500 border-2 border-white grid place-items-center text-white text-xs font-bold"
                    >
                      {r.userId?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  ))}
                  {goingCount > 4 && (
                    <div className="w-9 h-9 rounded-full bg-stone-100 border-2 border-white grid place-items-center text-stone-500 text-[10px] font-bold">
                      +{goingCount - 4}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-stone-900 font-bold">{goingCount} going</div>
                  <div className="text-[10px] text-stone-400">{interestedCount} interested</div>
                </div>
              </div>

              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRSVP("going")}
                    disabled={busy}
                    className={`text-xs font-semibold py-3 rounded-xl transition-all ${
                      rsvp === "going"
                        ? "bg-emerald-600 text-white shadow-[0_2px_8px_-2px_rgba(5,150,105,0.4)]"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {rsvp === "going" ? (
                      <><Check size={12} className="inline mr-1" /> Going</>
                    ) : (
                      "Going"
                    )}
                  </button>
                  <button
                    onClick={() => handleRSVP("interested")}
                    disabled={busy}
                    className={`text-xs font-semibold py-3 rounded-xl transition-all ${
                      rsvp === "interested"
                        ? "bg-orange-600 text-white shadow-[0_2px_8px_-2px_rgba(234,88,12,0.4)]"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {rsvp === "interested" ? (
                      <><Check size={12} className="inline mr-1" /> Interested</>
                    ) : (
                      "Interested"
                    )}
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block text-center text-xs font-semibold py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
                >
                  Log in to RSVP
                </Link>
              )}
            </div>

            {related.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-stone-400 mb-3">
                  Explore other events
                </p>
                <div className="space-y-3">
                  {related.map((e) => (
                    <Link
                      key={e._id}
                      to={`/events/${e._id}`}
                      className="group block bg-white border border-stone-200 hover:border-stone-300 rounded-xl p-3 transition-colors"
                    >
                      <div className="flex gap-3">
                        {e.coverImage && (
                          <img src={e.coverImage} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-stone-900 line-clamp-2 mb-1 group-hover:text-orange-700 transition-colors">
                            {e.title}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                        <ArrowUpRight
                          size={14}
                          className="text-stone-400 group-hover:text-orange-600 shrink-0 transition-colors"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm grid place-items-center px-4"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 border border-red-200 mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Delete this event?</h3>
            <p className="text-sm text-stone-500 mb-6">
              All RSVPs and details will be removed. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}