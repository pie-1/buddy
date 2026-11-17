// client/src/components/features/Profile/TrustRing.jsx
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const getLevel = (score) => {
  if (score >= 100) return { label: "Elite", color: "#7c3aed" };
  if (score >= 50) return { label: "Respected", color: "#059669" };
  if (score >= 20) return { label: "Trusted", color: "#ea580c" };
  return { label: "Newcomer", color: "#a8a29e" };
};

export default function TrustRing({ score = 0, size = 120, dark = false }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = 44;
  const circ = 2 * Math.PI * r;
  const level = getLevel(pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={level.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className={`text-3xl font-black leading-none ${dark ? "text-white" : "text-stone-900"}`}>{pct}</div>
            <div className={`text-[8px] uppercase tracking-widest font-bold mt-0.5 ${dark ? "text-gray-400" : "text-stone-400"}`}>Trust</div>
          </div>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: level.color }}>
        {level.label}
      </div>
    </div>
  );
}