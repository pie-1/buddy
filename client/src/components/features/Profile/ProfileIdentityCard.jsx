// client/src/components/features/Profile/ProfileIdentityCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaGlobe, FaTwitter } from "react-icons/fa";
import { FiMessageCircle, FiLoader, FiEdit2, FiStar } from "react-icons/fi";
import { RoleBadge, SpotlightBadge, StatusPill, CollegePill } from "./ProfileBadge";
import TrustRing from "./TrustRing";

const EASE = [0.22, 1, 0.36, 1];

function SocialLink({ icon: Icon, href, label }) {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-orange-700 transition-colors">
      <Icon size={14} /> {label}
    </a>
  );
}

function lastSeenLabel(user) {
  if (!user.lastSeenAt) return null;
  const mins = Math.floor((Date.now() - new Date(user.lastSeenAt).getTime()) / 60000);
  if (mins < 5) return "Active now";
  if (mins < 60) return `Active ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Active ${hrs}h ago`;
  return `Active ${Math.floor(hrs / 24)}d ago`;
}

export default function ProfileIdentityCard({ user, spotlight, isOwn, isAdminOrMod, mutual, messaging, onMessage }) {
  const navigate = useNavigate();
  const lastSeenText = lastSeenLabel(user);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="lg:sticky lg:top-32 self-start"
    >
      <div className={`bg-white border rounded-2xl p-6 ${spotlight?.active ? "border-purple-300 shadow-[0_0_32px_-8px_rgba(139,92,246,0.3)]" : "border-stone-200"}`}>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-2 border-stone-100" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 grid place-items-center text-white text-3xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            {spotlight?.active && (
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 grid place-items-center text-white shadow-lg">
                <FiStar size={12} fill="currentColor" />
              </div>
            )}
          </div>

          <h1 className="text-xl font-serif font-bold text-stone-900 mb-2">{user.name}</h1>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
            <RoleBadge user={user} />
            {spotlight?.active && <SpotlightBadge />}
          </div>

          <div className="mb-2"><StatusPill user={user} /></div>
          <div className="mb-3"><CollegePill user={user} /></div>

          {lastSeenText && <p className="text-[10px] text-stone-400 mb-4">{lastSeenText}</p>}

          {!isAdminOrMod && <div className="mt-1 mb-5"><TrustRing score={user.trustScore} /></div>}

          {isOwn ? (
            <Link
              to="/profile/edit"
              className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <FiEdit2 size={14} /> Edit profile
            </Link>
          ) : (
            <button
              onClick={onMessage}
              disabled={messaging}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {messaging ? <><FiLoader size={14} className="animate-spin" /> Opening…</> : <><FiMessageCircle size={14} /> Message</>}
            </button>
          )}
        </div>

        {(user.socials?.github || user.socials?.linkedin || user.socials?.portfolio || user.socials?.twitter) && (
          <div className="mt-5 pt-5 border-t border-stone-100">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">Links</div>
            <div className="flex flex-wrap gap-3">
              <SocialLink icon={FaGithub} href={user.socials?.github} label="GitHub" />
              <SocialLink icon={FaLinkedin} href={user.socials?.linkedin} label="LinkedIn" />
              <SocialLink icon={FaGlobe} href={user.socials?.portfolio} label="Portfolio" />
              <SocialLink icon={FaTwitter} href={user.socials?.twitter} label="X" />
            </div>
          </div>
        )}
      </div>

      {mutual?.length > 0 && (
        <div className="mt-4 bg-white border border-stone-200 rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-3">You both know</div>
          <div className="flex -space-x-2">
            {mutual.map((m) => (
              <Link
                key={m._id}
                to={`/profile/${m._id}`}
                className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-white grid place-items-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title={m.name}
              >
                {m.name?.[0]?.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}