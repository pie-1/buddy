// client/src/pages/ListingDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Loader2, ShieldCheck, Clock, Tag,
  FileText, ExternalLink, Pencil, AlertCircle, Trash2,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchListingById, deleteListing } from "../services/listingService";
import { startConversation } from "../services/chatService";
import DetailGallery from "../components/features/Marketplace/DetailGallery";
import SellerCard from "../components/features/Marketplace/SellerCard";

const EASE = [0.22, 1, 0.36, 1];

const CATEGORY_META = {
  sell: { label: "For sale", cls: "text-indigo-300 border-indigo-500/30 bg-indigo-500/10" },
  buy: { label: "Looking to buy", cls: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10" },
  rent: { label: "For rent", cls: "text-orange-300 border-orange-500/30 bg-orange-500/10" },
  borrow: { label: "To borrow", cls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
};

const isPdf = (url) => typeof url === "string" && url.toLowerCase().endsWith(".pdf");

export default function ListingDetail() {
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
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchListingById(id);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load this listing");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleRequest = async () => {
    if (!user) return navigate("/auth", { state: { from: { pathname: `/marketplace/${id}` } } });
    if (!listing || requesting) return;

    setRequesting(true);
    try {
      const conversation = await startConversation({
        recipientId: listing.sellerId._id,
        contextType: "listing",
        contextId: listing._id,
      });
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not open chat");
      setRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteListing(listing._id);
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this listing");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div data-nav-theme="dark" className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-32 px-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
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
          <h1 className="text-2xl font-serif font-bold mb-2">Listing not found</h1>
          <p className="text-gray-400 mb-8">{error || "This listing may have been removed."}</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft size={16} /> Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORY_META[listing.category] || CATEGORY_META.sell;
  const seller = listing.sellerId;
  const isOwner = user && seller && user._id === seller._id;
  const pdfs = (listing.images || []).filter(isPdf);
  const hasPdf = pdfs.length > 0;

  const priceLabel = listing.category === "rent" || listing.category === "borrow"
    ? `Rs. ${listing.price?.toLocaleString()} / ${listing.rentPeriod || "day"}`
    : `Rs. ${listing.price?.toLocaleString()}`;

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,.2), transparent 65%)" }} />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: gallery + content */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="space-y-8">
            <DetailGallery images={listing.images || []} title={listing.title} />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${cat.cls}`}>
                  {cat.label}
                </span>
                {hasPdf && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-500/40 bg-red-500/20 text-red-200 backdrop-blur-md">
                    <FileText size={10} /> {pdfs.length} PDF{pdfs.length > 1 ? "s" : ""}
                  </span>
                )}
                {listing.status !== "active" && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-500/40 bg-red-500/20 text-red-200 backdrop-blur-md">
                    {listing.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.05] mb-4">{listing.title}</h1>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* PDF attachments */}
            {hasPdf && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Attachments</h2>
                <div className="space-y-2">
                  {pdfs.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 bg-[#14121f] border border-white/10 hover:border-indigo-500/40 rounded-xl p-4 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 grid place-items-center shrink-0">
                          <FileText size={18} className="text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">Document {i + 1}</div>
                          <div className="text-xs text-gray-500">Click to open PDF</div>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: price + seller + action */}
          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} className="space-y-5 lg:sticky lg:top-32 self-start">
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">Price</div>
              <div className="text-4xl font-black text-white tracking-tight mb-6">{priceLabel}</div>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Tag size={14} /> Condition</span>
                  <span className="text-white font-bold capitalize">{listing.condition}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14} /> Listed</span>
                  <span className="text-white">{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><ShieldCheck size={14} /> Verified</span>
                  <span className="text-emerald-400 font-bold">Yes</span>
                </div>
              </div>

              {isOwner ? (
                <div className="space-y-2">
                  <Link
                    to={`/marketplace/${listing._id}/edit`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                  >
                    <Pencil size={16} /> Edit listing
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-bold px-5 py-3 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} /> Delete listing
                  </button>
                  <p className="text-xs text-gray-500 text-center pt-2">You posted this listing.</p>
                </div>
              ) : (
                <button
                  onClick={handleRequest}
                  disabled={requesting || listing.status !== "active"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(79,70,229,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {requesting ? (
                    <><Loader2 size={16} className="animate-spin" /> Opening chat…</>
                  ) : (
                    <><MessageCircle size={16} /> Request / Chat with seller</>
                  )}
                </button>
              )}
            </div>

            <SellerCard seller={seller} />
          </motion.aside>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center px-4"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#14121f] border border-white/10 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">Delete this listing?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will remove the listing from the marketplace. Existing chats about it will stay.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : <>Delete</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}