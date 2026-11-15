// client/src/pages/TeamRequestDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Loader2, Check, X, MessageCircle, AlertCircle,
  Calendar, MapPin, Pencil, Building2,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import {
  fetchTeamRequestById, applyToTeam, decideApplicant,
  deleteTeamRequest,
} from "../services/teamRequestService";
import { startConversation } from "../services/chatService";

const EASE = [0.22, 1, 0.36, 1];

export default function TeamRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tr, setTr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyMsg, setApplyMsg] = useState("");
  const [applying, setApplying] = useState(false);
  const [deciding, setDeciding] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchTeamRequestById(id);
      setTr(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const isOwner = user && tr?.posterId?._id === user._id;
  const myApplication = tr?.applicants?.find((a) => a.userId?._id === user?._id);

  const handleApply = async () => {
    if (!user) return navigate("/auth", { state: { from: { pathname: `/team-requests/${id}` } } });
    setApplying(true);
    try {
      await applyToTeam(id, applyMsg);
      const convo = await startConversation({
        recipientId: tr.posterId._id,
        contextType: "event",
        contextId: tr.eventId._id,
      });
      navigate(`/chat/${convo._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not apply");
      setApplying(false);
    }
  };

  const handleDecision = async (userId, decision) => {
    setDeciding(userId);
    try {
      await decideApplicant(id, userId, decision);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update applicant");
    } finally {
      setDeciding(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this team request?")) return;
    setDeleting(true);
    try {
      await deleteTeamRequest(id);
      navigate(`/events/${tr.eventId._id}`);
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
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      </div>
    );
  }

  if (error || !tr) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2 text-stone-900">Not found</h1>
          <p className="text-stone-500 mb-8">{error || "This team request may have been removed."}</p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Back to events
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = tr.spotsAvailable - (tr.applicants?.filter((a) => a.status === "accepted").length || 0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <button
          onClick={() => navigate(`/events/${tr.eventId._id}`)}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-5"
          >
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                  Looking for teammates
                </span>
                {tr.department && tr.department !== "Any" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Building2 size={10} /> {tr.department}
                  </span>
                )}
                <span className="text-xs text-indigo-700 font-semibold">
                  {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                </span>
                {isOwner && (
                  <Link
                    to={`/team-requests/${tr._id}/edit`}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">{tr.teamName}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 mb-5 pb-5 border-b border-stone-100">
                <Link to={`/events/${tr.eventId._id}`} className="inline-flex items-center gap-1.5 hover:text-orange-700 transition-colors">
                  <Calendar size={14} /> {tr.eventId.title}
                </Link>
                {tr.eventId.venue && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} /> {tr.eventId.venue}
                  </span>
                )}
              </div>

              <p className="text-stone-700 leading-relaxed whitespace-pre-line mb-5">{tr.pitch}</p>

              {tr.rolesNeeded?.length > 0 && (
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">Roles needed</div>
                  <div className="flex flex-wrap gap-2">
                    {tr.rolesNeeded.map((r) => (
                      <span key={r} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tr.skillTags?.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">Tech / skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tr.skillTags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isOwner && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h2 className="text-lg font-serif font-bold text-stone-900 mb-4">
                  Applicants ({tr.applicants?.length || 0})
                </h2>
                {(!tr.applicants || tr.applicants.length === 0) ? (
                  <p className="text-sm text-stone-500 italic">
                    No applicants yet. Share this request to get noticed.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tr.applicants.map((a) => (
                      <div
                        key={a.userId._id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50"
                      >
                        <div className="w-9 h-9 rounded-full bg-orange-500 grid place-items-center text-white text-xs font-bold shrink-0">
                          {a.userId.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-stone-900">{a.userId.name}</div>
                          <div className="text-xs text-stone-500">
                            {a.userId.university} • {a.status}
                          </div>
                          {a.message && (
                            <div className="text-xs text-stone-600 mt-1 italic">"{a.message}"</div>
                          )}
                        </div>
                        {a.status === "pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDecision(a.userId._id, "accepted")}
                              disabled={deciding === a.userId._id}
                              className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white grid place-items-center disabled:opacity-50 transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleDecision(a.userId._id, "rejected")}
                              disabled={deciding === a.userId._id}
                              className="w-8 h-8 rounded-lg bg-stone-300 hover:bg-stone-400 text-stone-700 grid place-items-center disabled:opacity-50 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        {a.status === "accepted" && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                            Accepted
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <aside className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-indigo-600 grid place-items-center text-white font-bold">
                  {tr.posterId?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{tr.posterId?.name}</div>
                  <div className="text-xs text-stone-500">
                    {tr.posterId?.university} • Trust {tr.posterId?.trustScore || 0}
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="space-y-2">
                  <Link
                    to={`/team-requests/${tr._id}/edit`}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 transition-colors"
                  >
                    <Pencil size={12} /> Edit request
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full text-xs font-semibold py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? "Deleting…" : "Delete request"}
                  </button>
                </div>
              ) : myApplication ? (
                <div className="text-center text-sm py-3 rounded-xl bg-stone-50 text-stone-600 border border-stone-200">
                  Applied • {myApplication.status}
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1.5 block">
                      Message to poster (optional)
                    </label>
                    <textarea
                      value={applyMsg}
                      onChange={(e) => setApplyMsg(e.target.value)}
                      rows={3}
                      placeholder="Why you'd be a good fit…"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying || tr.status !== "open"}
                    className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {applying ? (
                      <><Loader2 size={14} className="animate-spin" /> Applying…</>
                    ) : (
                      <><MessageCircle size={14} /> Request to join</>
                    )}
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}