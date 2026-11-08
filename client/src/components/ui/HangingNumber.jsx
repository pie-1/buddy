// client/src/components/ui/HangingNumber.jsx
import { motion } from "framer-motion";

export function HangingNumber({ num, color }) {
  return (
    <div className="absolute -top-40 left-0 md:-left-12 flex flex-col items-center pointer-events-none select-none z-0">
      {/* The Rope */}
      <div className="w-[1.5px] h-48 bg-gradient-to-b from-transparent via-white/10 to-white/30" />
      {/* The Number */}
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
        className={`text-[160px] md:text-[260px] font-serif font-black leading-none ${color} opacity-[0.15] drop-shadow-2xl`}
      >
        {num}
      </motion.div>
    </div>
  );
}