// client/src/components/features/Roommates/RoommateCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Home, Search, Users, Sparkles } from "lucide-react";

const GENDER = {
  any: { label: "Any", cls: "text-gray-300 border-white/10 bg-white/5" },
  male: { label: "Male", cls: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10" },
  female: { label: "Female", cls: "text-pink-300 border-pink-500/30 bg-pink-500/10" },
};

const KIND = {
  "have-room": {
    icon: Home,
    pill: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    label: "Has a room",
  },
  "looking-for-room": {
    icon: Search,
    pill: "text-indigo-300 border-indigo-500/30 bg-indigo-500/10",
    label: "Looking for a room",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function RoommateCard({ listing, index = 0 }) {
  const g = GENDER[listing.genderPreference] || GENDER.any;
  const kind = KIND[listing.kind] || KIND["have-room"];
  const KindIcon = kind.icon;
  const cover = listing.photos?.[0];
  const poster = listing.postedBy;

  const isHaveRoom = listing.kind === "have-room";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/roommates/${listing._id}`}
        className="relative block h-full flex flex-col bg-[#14121f] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300"
        style={{ boxShadow: "0 8px 24px -12px rgba(0,0,0,0.6)" }}
      >
        <div className="relative h-44 bg-white/5 overflow-hidden shrink-0">
          {cover ? (
            <img src={cover} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/[0.06]">
              <KindIcon size={64} />
            </div>
          )}

          {/* kind pill */}
          <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${kind.pill}`}>
            <KindIcon size={10} /> {kind.label}
          </span>

          {/* gender pill */}
          <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${g.cls}`}>
            {g.label}
          </span>
        </div>

        <div className="relative p-5 flex flex-col flex-1">
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">{listing.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/[0.03] border border-white/10 px-2 py-1 rounded-md">
              <MapPin size={10} /> {listing.area}
            </span>
            {isHaveRoom ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/[0.03] border border-white/10 px-2 py-1 rounded-md">
                <Users size={10} /> {listing.roomType}
              </span>
            ) : (
              listing.budgetMax && (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/[0.03] border border-white/10 px-2 py-1 rounded-md">
                  <Sparkles size={10} /> ≤ Rs. {listing.budgetMax.toLocaleString()}
                </span>
              )
            )}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">
                {isHaveRoom ? "Rent" : "Budget"}
              </div>
              <div className="text-xl font-black text-white tracking-tight">
                {isHaveRoom ? (
                  <>Rs. {listing.rent?.toLocaleString()}<span className="text-xs text-gray-500 font-medium">/mo</span></>
                ) : (
                  <>Rs. {listing.budgetMin?.toLocaleString() ?? "—"} – {listing.budgetMax?.toLocaleString() ?? "—"}</>
                )}
              </div>
            </div>
            {poster && (
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">Posted by</div>
                <div className="text-xs text-gray-300 truncate max-w-[110px]">{poster.name}</div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}