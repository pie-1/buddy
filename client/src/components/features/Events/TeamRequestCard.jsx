// client/src/components/features/Events/TeamRequestCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Building2 } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function TeamRequestCard({ tr, index = 0 }) {
  const poster = tr.posterId;
  const spotsLeft = tr.spotsAvailable - (tr.applicants?.filter((a) => a.status === "accepted").length || 0);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -2 }}
    >
      <Link
        to={`/team-requests/${tr._id}`}
        className="group block bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-200/70 hover:border-indigo-300 rounded-2xl p-5 transition-all"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-indigo-600 text-white">
              Looking for teammates
            </span>
            {tr.department && tr.department !== "Any" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200">
                <Building2 size={10} /> {tr.department}
              </span>
            )}
            <span className="text-[10px] text-indigo-700 font-semibold">
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
          <ArrowUpRight size={16} className="text-indigo-500 group-hover:text-indigo-700 shrink-0 transition-colors" />
        </div>

        <h4 className="font-serif font-bold text-lg text-indigo-950 mb-1.5 leading-snug">{tr.teamName}</h4>
        <p className="text-sm text-indigo-900/70 leading-relaxed line-clamp-2 mb-3">{tr.pitch}</p>

        {tr.rolesNeeded?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tr.rolesNeeded.map((r) => (
              <span key={r} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200">
                {r}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-indigo-200/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 grid place-items-center text-white text-[10px] font-bold">
              {poster?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="text-xs text-indigo-900/80">
              <span className="font-semibold">{poster?.name || "Unknown"}</span>
              {poster?.university && <span className="text-indigo-700/60"> • {poster.university}</span>}
            </div>
          </div>
          {tr.skillTags?.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-indigo-700/70">
              <Sparkles size={10} /> {tr.skillTags.slice(0, 2).join(", ")}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}