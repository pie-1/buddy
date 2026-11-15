// client/src/components/features/Profile/TrustRing.jsx
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function TrustRing({ score }) {
  const pct = Math.min(100, Math.max(0, score || 0));
  const r = 40;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-black text-stone-900">{pct}</div>
          <div className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Trust</div>
        </div>
      </div>
    </div>
  );
}