// client/src/components/features/Profile/ProfileIdentityCard.jsx
import { Link } from "react-router-dom";
import { FiMessageCircle, FiLoader, FiEdit3 } from "react-icons/fi";
import { Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export default function ProfileIdentityCard({
  user, spotlight, isOwn, isAdminOrMod, mutual, commonGround, messaging, onMessage
}) {
  const isAlumni = user.isAlumni;
  const gradYear = user.graduationYear ? String(user.graduationYear).slice(-2) : "";
  const deptShort = user.department ? user.department.substring(0, 4).toUpperCase() : "STUDENT";
  
  // Calculate a fake trust score visual width if the actual trust score is low
  const displayTrust = user.trustScore || 0;

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 🌟 THE BUDDY PASS (Inspired by Landing Page) 🌟 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#26226b] to-[#0c0b18] border border-indigo-400/40 shadow-xl text-white">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/10">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em]">
            <span className="grid place-items-center w-6 h-6 rounded-md bg-white text-[#1e1b4b] text-[12px] font-serif font-black">C</span>
            BUDDY PASS
          </span>
          <small className="text-emerald-400 tracking-widest font-extrabold text-[9px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
          </small>
        </div>

        {/* Identity */}
        <div className="p-5 flex items-center gap-4">
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-400/50 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-2xl shadow-lg border border-indigo-400/50">
                🎓
              </div>
            )}
            {/* Spotlight indicator */}
            {spotlight?.active && (
              <div className="absolute -bottom-1.5 -right-1.5 bg-purple-500 p-1 rounded-md border border-[#0c0b18] shadow-sm" title="Spotlighted">
                <Sparkles size={10} className="text-white fill-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold leading-tight">{user.name}</h1>
            <p className="text-[11px] text-indigo-300/80 mt-1">
              @{user.name.split(' ')[0].toLowerCase()} • {deptShort} '{gradYear}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
          {/* Trust Score */}
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <b className="text-2xl text-orange-400 leading-none">{displayTrust}</b>
                <span className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">Trust score</span>
              </div>
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-1000" 
                style={{ width: `${Math.min(displayTrust, 100)}%` }} 
              />
            </div>
          </div>
          
          {/* Role / Status */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Role</span>
            <span className="text-white text-xs font-semibold capitalize mt-1 flex items-center gap-1.5">
              <GraduationCap size={12} className="text-indigo-400" /> {user.role}
            </span>
          </div>

          {/* University */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Campus</span>
            <span className="text-white text-xs font-semibold mt-1">{user.university || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* 🌟 COMMON GROUND (Recommendation Engine) 🌟 */}
      {!isOwn && commonGround?.reasons?.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 mb-3">
            <Sparkles size={14} className="text-indigo-500" /> Why you should connect
          </div>
          <div className="space-y-2">
            {commonGround.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {reason}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions & Info */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        
        {/* Bio */}
        {user.bio && (
          <div>
            <p className="text-sm text-stone-600 leading-relaxed italic">"{user.bio}"</p>
          </div>
        )}

        {/* Action Buttons */}
        {!isOwn ? (
          <button
            onClick={onMessage}
            disabled={messaging}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            {messaging ? <FiLoader size={16} className="animate-spin" /> : <FiMessageCircle size={16} />}
            Message
          </button>
        ) : (
          <Link
            to="/profile/edit"
            className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-sm font-semibold py-3 rounded-xl transition-all shadow-sm"
          >
            <FiEdit3 size={16} /> Edit profile
          </Link>
        )}

        {/* Mutual Connections */}
        {mutual && mutual.length > 0 && (
          <div className="pt-4 border-t border-stone-100">
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
                {mutual.length} mutual {mutual.length === 1 ? 'connection' : 'connections'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}