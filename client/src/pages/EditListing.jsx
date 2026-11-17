// client/src/pages/EditListing.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import ListingForm from "../components/features/Marketplace/ListingForm";
import { fetchListingById, updateListing } from "../services/listingService";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchListingById(id);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load listing");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateListing(id, payload);
    navigate(`/marketplace/${id}`);
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
          <h1 className="text-2xl font-serif font-bold mb-2">Cannot edit this listing</h1>
          <p className="text-gray-400 mb-8">{error || "This listing may have been removed."}</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft size={16} /> Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <ListingForm
        mode="edit"
        initialValues={listing}
        onSubmit={handleSubmit}
        eyebrow="Edit listing"
        heading={
          <>
            Update your
            <span className="italic text-indigo-400"> listing.</span>
          </>
        }
        submitLabel="Save changes"
      />
    </div>
  );
}