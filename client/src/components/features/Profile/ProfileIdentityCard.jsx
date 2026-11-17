// client/src/components/features/Profile/ProfileIdentityCard.jsx
import { useState } from "react";
import { FiMessageCircle, FiLoader, FiHeart } from "react-icons/fi";
import { Sparkles, GraduationCap } from "lucide-react";
import TrustRing from "./TrustRing";
import { likeUser, unlikeUser } from "../../../services/userService";

export default function ProfileIdentityCard({
  user, spotlight, isOwn, isAdminOrMod, mutual, commonGround, messaging, onMessage,
}) {
  const isAlumni = user.isAlumni;
  const gradYear = user.graduationYear ? String(user.graduationYear).slice(-2) : "";
  const deptShort = user.department ? user.department.substring(0, 4).toUpperCase() : "STUDENT";

  const [liked, setLiked] = useState(user.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(user.likesCount || 0);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking || isOwn) return;
    setLiking(true);
    try {
      if (liked) {
        await unlikeUser(user._id);
        setLikesCount((n) => Math.max(0, n - 1));
        setLiked(false);
      } else {
        await likeUser(user._id);
        setLikesCount((n) => n + 1);
        setLiked(true);
      }
    } catch {
      /* silent */
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* THE BUDDY PASS CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-[#14121f] border border-indigo-500/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] text-white">
        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/10 bg-gradient-to-r from-[#26226b]/50 to-transparent">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em]">
            <span className="grid place-items-center w-6 h-6 rounded-md bg-white text-[#1e1b4b] text-[12px] font-serif font-black">C</span>
            BUDDY PASS
          </span>
          <small className="text-emerald-400 tracking-widest font-extrabold text-[9px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
          </small>
        </div>

        <div className="p-6 pb-4 flex items-start gap-5">
          <div className="relative shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-3xl shadow-lg border border-indigo-400/50">
                🎓
              </div>
            )}
            {spotlight?.active && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-1.5 rounded-lg border-2 border-[#14121f] shadow-lg" title="Spotlighted">
                <Sparkles size={12} className="text-white fill-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 pt-1 flex-1">
            <h1 className="text-2xl font-serif font-bold leading-tight truncate">{user.name}</h1>
            <p className="text-xs text-indigo-300/80 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              @{user.name.split(" ")[0].toLowerCase()} • {deptShort} '{gradYear}
            </p>
            {user.university && (
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                {user.university} Node
              </p>
            )}
          </div>
        </div>

        {/* Stats row: trust ring + role + status */}
        <div className="px-6 pb-6 grid grid-cols-[auto_1fr] gap-4 items-center">
          <TrustRing score={user.trustScore || 0} size={108} dark />
          <div className="space-y-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1 block">Role</span>
              <span className="text-white text-xs font-semibold capitalize flex items-center gap-1.5">
                <GraduationCap size={14} className="text-indigo-400" /> {user.role}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1 block">Status</span>
              <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                {isAdminOrMod ? (user.role === "admin" ? "Admin" : "Moderator") : (isAlumni ? "Alumni" : "Student")}
              </span>
            </div>
          </div>
        </div>

        {/* Action row */}
        {!isOwn && (
          <div className="px-6 pb-6 flex gap-2">
            <button
              onClick={onMessage}
              disabled={messaging}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold px-4 py-3 rounded-xl transition-all"
            >
              {messaging ? <><FiLoader size={14} className="animate-spin" /> Opening…</> : <><FiMessageCircle size={14} /> Message</>}
            </button>
            <button
              onClick={handleLike}
              disabled={liking}
              className={`inline-flex items-center justify-center gap-1.5 text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                liked
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-rose-500/10 hover:text-rose-300"
              }`}
            >
              <FiHeart size={14} fill={liked ? "currentColor" : "none"} />
              {likesCount > 0 && likesCount}
            </button>
          </div>
        )}
      </div>

      {/* Common ground, bio, mutual — unchanged from before */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        {!isOwn && commonGround?.reasons?.length > 0 && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 mb-3">
              <Sparkles size={14} className="text-indigo-500" /> Why you should connect
            </div>
            <div className="space-y-2">
              {commonGround.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-indigo-900 font-medium">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {user.bio && (
          <div>
            <p className="text-sm text-stone-600 leading-relaxed italic">"{user.bio}"</p>
          </div>
        )}

        {mutual && mutual.length > 0 && (
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">You both know</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {mutual.map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm" title={m.name}>
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {mutual.length} mutual {mutual.length === 1 ? "connection" : "connections"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}