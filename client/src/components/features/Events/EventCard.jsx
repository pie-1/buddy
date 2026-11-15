// client/src/components/features/Events/EventCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Ticket, Zap, ArrowUpRight, Star } from "lucide-react";

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const daysUntil = (d) => (d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null);

export default function EventCard({ event, index = 0 }) {
  const deadlineDays = daysUntil(event.registrationDeadline);
  const isClosing = deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 3;
  const isEnded = deadlineDays !== null && deadlineDays < 0;
  const isLive = daysUntil(event.date) === 0;
  const isSpotlight =
    event.organizerId?.spotlightUntil && new Date(event.organizerId.spotlightUntil) > new Date();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <Link
        to={`/events/${event._id}`}
        className={`flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border transition-all ${
          isSpotlight
            ? "border-purple-300 hover:border-purple-400 shadow-[0_8px_32px_-12px_rgba(139,92,246,0.25)]"
            : "border-stone-200/80 hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12)]"
        }`}
      >
        {/* Banner */}
        <div className="relative sm:w-64 shrink-0 h-44 sm:h-auto overflow-hidden bg-stone-100">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <Calendar size={48} />
            </div>
          )}
          {isLive && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live today
            </span>
          )}
          {!isLive && isClosing && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-600 text-white shadow-sm">
              <Zap size={10} /> {deadlineDays === 0 ? "Closes today" : `${deadlineDays}d left`}
            </span>
          )}
          {isEnded && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-stone-700 text-white">
              Ended
            </span>
          )}
          {isSpotlight && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              <Star size={9} fill="currentColor" /> Spotlight
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-orange-700 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <ArrowUpRight size={18} className="text-stone-400 group-hover:text-orange-600 shrink-0 transition-colors" />
          </div>

          <div className="space-y-2 mb-3 text-sm text-stone-600">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-stone-400 shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {event.endDate && ` → ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-stone-400 shrink-0" />
              <span>{MODE_LABEL[event.mode]}</span>
              <span className="text-stone-300">•</span>
              <Ticket size={14} className="text-stone-400 shrink-0" />
              <span>{event.cost}</span>
            </div>
          </div>

          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">{event.description}</p>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {event.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${TAG_STYLES[tag] || "bg-stone-100 text-stone-700 border-stone-200"}`}
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 5 && (
                <span className="text-[10px] font-semibold text-stone-400 px-1.5 py-1">+{event.tags.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}