import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import ListingForm from "../components/features/Marketplace/ListingForm";
import { createListing } from "../services/listingService";

export default function CreateListing() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const created = await createListing(payload);
    navigate(`/marketplace/${created._id}`);
  };

  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      <ListingForm
        mode="create"
        onSubmit={handleSubmit}
        eyebrow="New listing"
        heading={
          <>
            Tell campus what
            <span className="italic text-indigo-400"> you've got.</span>
          </>
        }
        submitLabel="Publish listing"
      />
    </div>
  );
}