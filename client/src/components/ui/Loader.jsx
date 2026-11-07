import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Verifying .edu.np", "Finding your circle", "Unlocking campus"];

// one loop: scan line sweeps down and the dark pass is revealed behind it, holds, then wipes away
const LOOP = { duration: 2.8, repeat: Infinity, times: [0, 0.5, 0.8, 1], ease: "easeInOut" };

// one organic contour, drawn 6 times at different sizes
const BLOB =
  "M120 20 C170 18 215 55 218 105 C221 160 170 205 115 202 C60 199 22 150 25 100 C28 55 70 22 120 20 Z";

export function Loader({ fullScreen = false }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1400);
    return () => clearInterval(id);
  }, []);

  const L = fullScreen ? 320 : 48; // string length (px)

  const content = (
    <div className="relative z-10 flex flex-col items-center">
      {/* hanging ID card: swings like a pendulum from the top of its string */}
      <motion.div
        className="relative w-[150px] h-[210px]"
        style={{ transformOrigin: `50% -${L}px` }}
        initial={{ rotate: -2.5 }}
        animate={{ rotate: 2.5 }}
        transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        {/* string + clip */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-gray-300 to-gray-400"
          style={{ height: L }}
        />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-6 rounded-md bg-gray-200 border border-gray-300 shadow-sm grid place-items-center">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
        </div>

        {/* plain ID */}
        <div className="absolute inset-0 rounded-2xl bg-[#f4f3ee] border border-[#d6d0c4] shadow-[0_24px_40px_-14px_rgba(0,0,0,0.2)] p-3 pt-5 flex flex-col items-center z-10">
          <span className="text-[7px] tracking-[0.25em] font-bold text-gray-700">COLLEGEBUDDY</span>
          <div className="mt-3 w-14 h-16 rounded-md bg-[#e4e4e7] border border-[#c4bdaf] grid place-items-center">
            <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="mt-3 w-full flex flex-col items-center gap-1.5">
            <div className="h-1.5 w-3/4 rounded bg-gray-300" />
            <div className="h-1.5 w-1/2 rounded bg-gray-200" />
          </div>
          <div className="mt-auto w-full h-5 rounded-sm bg-[repeating-linear-gradient(90deg,#9ca3af_0_2px,transparent_2px_4px)] opacity-60" />
        </div>

        {/* dark pass, revealed top-to-bottom by the scan */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#09090b] border border-indigo-500/40 p-3 pt-5 flex flex-col items-center z-20"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{
            clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
          }}
          transition={LOOP}
        >
          <span className="text-[7px] tracking-[0.25em] font-bold text-indigo-200">BUDDY PASS</span>
          <div className="mt-3 w-14 h-16 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/50 grid place-items-center text-3xl shadow-lg shadow-indigo-500/30">
            🎓
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[8px] font-extrabold tracking-widest text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
          </div>
          <div className="mt-auto w-full h-5 rounded-sm bg-[repeating-linear-gradient(90deg,#a5b4fc_0_2px,transparent_2px_4px)] opacity-70" />
        </motion.div>

        {/* scan line, rides the edge of the reveal */}
        <motion.div
          className="absolute -left-2 -right-2 h-[2px] rounded-full z-30 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_16px_4px_rgba(99,102,241,0.45)]"
          initial={{ top: "0%", opacity: 1 }}
          animate={{ top: ["0%", "100%", "100%", "100%"], opacity: [1, 1, 0, 0] }}
          transition={LOOP}
        />
      </motion.div>

      {/* status text + step dots */}
      <div className="mt-12 h-10 flex flex-col items-center gap-3">
        <div className="h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] text-indigo-600 tracking-[0.2em] uppercase font-bold"
            >
              {STEPS[step]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-5 bg-indigo-500" : "w-1.5 bg-indigo-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf8] overflow-hidden">
        {/* contour rings that draw themselves in, then slowly breathe */}
        <svg
          viewBox="-100 -90 440 400"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(120vw,1100px)] pointer-events-none overflow-visible"
          style={{
            maskImage: "radial-gradient(circle, #000 25%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle, #000 25%, transparent 72%)",
          }}
        >
          {[0.3, 0.5, 0.7, 0.9, 1.1, 1.3].map((s, i) => (
            <motion.path
              key={s}
              d={BLOB}
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth="0.55"
              style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0.28 - i * 0.03 }}
              initial={{ pathLength: 0, scale: s, rotate: i * 14 }}
              animate={{ pathLength: 1, scale: [s, s * 1.05, s], rotate: [i * 14, i * 14 + (i % 2 ? -8 : 8), i * 14] }}
              transition={{
                pathLength: { duration: 1.4, delay: i * 0.15, ease: "easeOut" },
                scale: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 9 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}
        </svg>
        {content}
      </div>
    );
  }

  return <div className="py-16 w-full flex justify-center">{content}</div>;
}