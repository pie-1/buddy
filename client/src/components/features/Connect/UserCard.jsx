// client/src/components/features/Connect/UserCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { likeUser, unlikeUser } from "../../../services/userService";
import { StatusPill, RoleBadge } from "../Profile/ProfileBadge";

const Label = ({ children }) => (
  <span className="block text-[9px] text-stone-500 uppercase tracking-widest font-bold mb-1">{children}</span>
);

export default function UserCard({ user, isOwn, isSpotlighted, rank }) {
  const { user: me } = useContext(AuthContext);
  const isAdmin = user.role === "admin" || user.role === "moderator";

  const [liked, setLiked] = useState(user.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(user.likesCount || 0);
  const [liking, setLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liking || isOwn || !me) return;
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

  const isAlumni = user.graduationYear && user.graduationYear <= new Date().getFullYear();
  const gradYear = user.graduationYear ? String(user.graduationYear).slice(-2) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative w-full max-w-[320px] mx-auto flex flex-col rounded-2xl transition-all ${
        isSpotlighted
          ? "shadow-[0_20px_50px_-12px_rgba(168,85,247,0.45)] ring-2 ring-purple-400"
          : "shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.35)]"
      }`}
    >
      {/* Spotlight Rank Ribbon */}
      {isSpotlighted && (
        <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Rank #{rank}
        </div>
      )}

      {/* The ID Card Body */}
      <Link
        to={isOwn ? "/profile/edit" : `/profile/${user._id}`}
        className={`relative z-10 flex flex-col h-[440px] rounded-2xl overflow-hidden transition-all ${
          isSpotlighted
            ? "bg-gradient-to-b from-[#fdfaff] to-[#f5efff] border-2 border-purple-300 hover:border-purple-400"
            : "bg-gradient-to-b from-white to-[#f7f5f1] border-2 border-stone-300 hover:border-stone-400"
        }`}
      >
        {/* University Header */}
        <div
          className={`text-center pt-5 pb-3 border-b mx-5 ${
            isSpotlighted ? "border-purple-200/70" : "border-stone-200"
          }`}
        >
          <b className="block text-[11px] tracking-[0.15em] uppercase text-stone-900 font-serif">
            {user.university || "Purbanchal University"}
          </b>
          <small className="block text-[8px] tracking-[0.2em] uppercase text-stone-500 mt-1">
            Official University Identification
          </small>
        </div>

        {/* Photo */}
        <div className="mt-4 mb-4 mx-auto w-24 h-28 bg-[#efefef] rounded-md border border-stone-300 grid place-items-center overflow-hidden shrink-0 shadow-inner">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-10 h-10 text-stone-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 px-6 flex flex-col gap-3">
          <div>
            <Label>Name</Label>
            <p className="text-[17px] font-bold text-stone-900 tracking-wide truncate">{user.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Branch</Label>
              <p className="text-[12px] text-stone-800 font-semibold truncate">
                {user.department || "—"}
              </p>
            </div>
            <div>
              <Label>{isAlumni ? "Graduated" : "Batch"}</Label>
              <p className="text-[12px] text-stone-800 font-semibold truncate">
                {gradYear ? `'${gradYear}` : "—"}
              </p>
            </div>
          </div>

          <div>
            <Label>Campus</Label>
            <p className="text-[12px] text-stone-800 font-semibold truncate flex items-center gap-1">
              <Building2 size={11} className="text-stone-400 shrink-0" />
              {user.college || `${user.university || "TU"} Node`}
            </p>
          </div>

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    {s}
                  </span>
                ))}
                {user.skills.length > 3 && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 text-stone-400">
                    +{user.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Trust + Role row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm">
              <ShieldCheck size={13} />
              {user.trustScore || 0}
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-0.5">Trust</span>
            </div>
            <div className="flex gap-1">
              <StatusPill user={user} />
              {isAdmin && <RoleBadge user={user} />}
            </div>
          </div>
        </div>

        {/* Like button (for others only) */}
        {!isOwn && me && (
          <div className="px-6 pt-2">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg transition-all ${
                liked
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              }`}
            >
              <Heart size={11} fill={liked ? "currentColor" : "none"} />
              {likesCount > 0 ? `${likesCount} ${likesCount === 1 ? "like" : "likes"}` : "Like"}
            </button>
          </div>
        )}

        {/* Highlight banner */}
        <div
          className={`mt-3 mb-3 mx-6 px-2 py-1.5 text-[9px] text-center border-dashed rounded font-bold uppercase tracking-wider ${
            isSpotlighted
              ? "border-purple-300 bg-purple-50 text-purple-700"
              : "border-orange-200 bg-orange-50 text-orange-700"
          }`}
        >
          {isOwn
            ? "✓ This is your ID. Tap to edit"
            : isSpotlighted
            ? "⭐ Top Campus Member"
            : "Tap to view full Buddy Pass"}
        </div>

        {/* Barcode */}
        <div className="flex flex-col items-center justify-center pb-4">
          <div className="h-6 w-36 rounded-sm bg-[repeating-linear-gradient(90deg,#78716c_0_1px,transparent_1px_3px,#78716c_3px_4px,transparent_4px_7px)] opacity-60" />
          <span className="font-mono text-[8px] text-stone-500 tracking-widest mt-1.5">
            CB/{user.university?.slice(0, 2) || "TU"}/{user._id.slice(-4).toUpperCase()}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}