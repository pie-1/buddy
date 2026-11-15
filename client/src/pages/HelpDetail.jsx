// client/src/pages/HelpDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLoader, FiAlertCircle, FiCheckCircle, FiTrash2, FiSend } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import {
  fetchHelpPostById, replyToHelpPost, toggleHelpPostStatus, deleteHelpPost,
} from "../services/helpService";

const EASE = [0.22, 1, 0.36, 1];

export default function HelpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchHelpPostById(id);
      setPost(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const updated = await replyToHelpPost(id, replyText.trim());
      setPost(updated);
      setReplyText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reply");
    } finally {
      setSending(false);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleHelpPostStatus(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteHelpPost(id);
      navigate("/help");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="pt-32 flex justify-center"><FiLoader className="animate-spin text-orange-500" size={32} /></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <FiAlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Post not found</h1>
          <p className="text-stone-500 mb-8">{error}</p>
          <Link to="/help" className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-semibold px-6 py-3 rounded-xl"><FiArrowLeft size={16} /> Back</Link>
        </div>
      </div>
    );
  }

  const isAuthor = me?._id === post.authorId?._id;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <Link to="/help" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6">
          <FiArrowLeft size={16} /> Back to help board
        </Link>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-indigo-500 grid place-items-center text-white text-xs font-bold">
                {post.authorId?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-stone-900">{post.authorId?.name}</div>
                <div className="text-stone-400">{post.authorId?.university} · {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
              </div>
            </div>
            {post.status === "resolved" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                <FiCheckCircle size={10} /> Resolved
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-3">{post.title}</h1>
          <p className="text-stone-700 leading-relaxed whitespace-pre-line mb-4">{post.description}</p>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">{t}</span>
              ))}
            </div>
          )}

          {isAuthor && (
            <div className="flex gap-2 pt-4 border-t border-stone-100">
              <button onClick={handleToggle} className="text-xs font-semibold px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700">
                {post.status === "open" ? "Mark resolved" : "Reopen"}
              </button>
              <button onClick={handleDelete} className="text-xs font-semibold px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1">
                <FiTrash2 size={12} /> Delete
              </button>
            </div>
          )}
        </motion.article>

        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">{post.replies?.length || 0} replies</h2>
          {post.replies?.map((r, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-orange-500 grid place-items-center text-white text-[10px] font-bold">
                  {r.userId?.name?.[0]?.toUpperCase()}
                </div>
                <span className="font-semibold text-stone-800">{r.userId?.name}</span>
                <span className="text-stone-400">{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleReply} className="bg-white border border-stone-200 rounded-2xl p-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder="Write a reply…"
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-orange-500 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button type="submit" disabled={!replyText.trim() || sending} className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40">
              {sending ? <><FiLoader size={14} className="animate-spin" /> Sending…</> : <><FiSend size={14} /> Reply</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}