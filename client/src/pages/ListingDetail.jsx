// client/src/pages/ListingDetail.jsx  — placeholder for Phase 2.4
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { ArrowLeft } from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-32 px-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={16} /> Back to marketplace
        </Link>
        <h1 className="text-3xl font-serif font-bold mb-4">Listing Detail</h1>
        <p className="text-gray-400">Detail page for ID: {id} — coming in Phase 2.4</p>
      </div>
    </div>
  );
}