// client/src/components/features/Chat/ThreadHeader.jsx
import { Link } from "react-router-dom";
import { Package, Home, Calendar, FolderKanban, User } from "lucide-react";

const CONTEXT_META = {
  listing: { label: "Marketplace", icon: Package, to: (id) => `/marketplace/${id}`, cls: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30" },
  roommate: { label: "Roommate", icon: Home, to: (id) => `/roommates/${id}`, cls: "text-orange-300 bg-orange-500/10 border-orange-500/30" },
  event: { label: "Event", icon: Calendar, to: (id) => `/events/${id}`, cls: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30" },
  project: { label: "Project", icon: FolderKanban, to: (id) => `/projects/${id}`, cls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
  direct: { label: "Direct", icon: User, to: null, cls: "text-gray-300 bg-white/5 border-white/10" },
};

export default function ThreadHeader({ conversation, otherUser, onMarkDone, marking }) {
  const meta = CONTEXT_META[conversation.contextType] || CONTEXT_META.direct;
  const Icon = meta.icon;
  const isSystemEvent = conversation.lastMessage?.text?.startsWith("[marked-");

  return (
    <div className="border-b border-white/10 bg-[#0f0e1a] px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold shrink-0">
          {otherUser?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold truncate">{otherUser?.name || "Unknown"}</div>
          <Link
            to={meta.to?.(conversation.contextId) || "#"}
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1 ${meta.cls} hover:opacity-80 transition-opacity`}
          >
            <Icon size={9} /> {meta.label}
          </Link>
        </div>
      </div>

      {onMarkDone && !isSystemEvent && (
        <button
          onClick={onMarkDone}
          disabled={marking}
          className="shrink-0 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
        >
          {marking ? "Marking…" : "Mark as done"}
        </button>
      )}
    </div>
  );
}