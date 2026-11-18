import { motion } from "framer-motion";
import { STUDENT as S } from "./studentData";

const Label = ({ children, className = "" }) => (
  <span className={`block text-[7px] md:text-[8px] text-stone-500 uppercase tracking-widest font-medium ${className}`}>{children}</span>
);

const QR = [
  "1110101", "1010011", "1110110", "0001101", "1101011", "0110001", "1011101",
];

function MiniQR() {
  return (
    <div aria-hidden className="grid grid-cols-7 gap-[1.5px] p-1 md:p-1.5 rounded-md bg-white shrink-0 border border-stone-200">
      {QR.flatMap((row, r) => row.split("").map((c, i) => (
        <span key={`${r}-${i}`} className={`w-[2px] h-[2px] md:w-[3px] md:h-[3px] ${c === "1" ? "bg-stone-900" : "bg-transparent"}`} />
      )))}
    </div>
  );
}

export function HeroCard({ cardRef, passRef, scale, y, hintOpacity }) {
  return (
    <motion.div ref={cardRef} style={{ scale, y }} className="relative w-[280px] sm:w-[320px] md:w-[340px] h-[420px] sm:h-[480px] md:h-[500px] z-20">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute -top-14 md:-top-16 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/90 border border-indigo-100 text-[11px] md:text-[13px] font-medium text-indigo-600 flex items-center gap-1.5 md:gap-2 shadow-lg backdrop-blur-sm"
        >
          <span className="text-indigo-400">✨</span>
          <span className="[@media(hover:none)]:hidden">Move your cursor to scan</span>
          <span className="hidden [@media(hover:none)]:inline">Scroll to unlock your pass</span>
        </motion.div>

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[1.5px] h-[70vh] bg-gradient-to-b from-transparent via-stone-300 to-stone-400" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-6 rounded-md bg-stone-200 border border-stone-300 shadow-sm grid place-items-center">
          <span className="w-2 h-2 rounded-full bg-stone-400" />
        </div>

        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f7f3ee] via-[#f5f0e8] to-[#f0e8dd] border border-[#d8cfc2] shadow-[0_30px_60px_-15px_rgba(120,80,40,0.15)] flex flex-col z-10 p-4 md:p-6">
          
          <div className="text-center pb-3 md:pb-4 border-b border-stone-300/50">
            <b className="block text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-stone-800 font-serif">{S.university}</b>
            <small className="block text-[6px] md:text-[7px] tracking-[0.2em] uppercase text-stone-500 mt-1">Official University Identification</small>
          </div>

          <div className="mt-4 md:mt-6 mb-4 md:mb-5 mx-auto w-20 h-24 md:w-24 md:h-28 bg-gradient-to-br from-[#e8dfd2] to-[#ddd3c3] rounded-md border border-[#cfc4b2] grid place-items-center shadow-inner">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-stone-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <div className="flex-1 flex flex-col gap-2 md:gap-3">
            <div>
              <Label>Name</Label>
              <p className="text-[13px] md:text-[15px] font-semibold text-stone-800 tracking-wide mt-0.5">{S.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <Label>Roll No.</Label>
                <p className="font-mono text-[10px] md:text-[11px] text-stone-700 mt-0.5">{S.roll}</p>
              </div>
              <div>
                <Label>Branch</Label>
                <p className="text-[10px] md:text-[11px] text-stone-700 mt-0.5">{S.program}</p>
              </div>
            </div>

            <div>
              <Label>University Email</Label>
              <p className="font-mono text-[10px] md:text-[11px] text-stone-700 mt-0.5">{S.email}</p>
            </div>
          </div>

          <div className="mt-auto mb-3 md:mb-4 px-2 py-1 md:py-1.5 text-[7px] md:text-[8px] text-center text-red-700 bg-red-50 border border-red-200 border-dashed rounded font-bold uppercase tracking-wider">
            ⚠ Keep This Card With You
          </div>

          <div className="mt-auto flex flex-col items-center justify-center">
            <div aria-hidden className="h-5 md:h-6 w-28 md:w-32 rounded-sm bg-[repeating-linear-gradient(90deg,#8b7d6b_0_1px,transparent_1px_3px,#8b7d6b_3px_4px,transparent_4px_7px)] opacity-70" />
            <span className="font-mono text-[6px] md:text-[7px] text-stone-500 tracking-widest mt-1">DTU/24/CS/1002/2028</span>
          </div>
        </div>

        <div
          ref={passRef}
          style={{ clipPath: "circle(0px at 0 0)" }}
          className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#17143a] to-[#09090b] rounded-2xl p-4 md:p-5 flex flex-col gap-2 md:gap-3 z-20 border border-indigo-500/40 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)]"
        >
          <motion.div aria-hidden animate={{ x: ["-130%", "230%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }} className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none" />
          
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-1.5 md:gap-2 text-white text-[9px] md:text-[10px] font-bold tracking-[0.2em]">
              <span className="grid place-items-center w-4 h-4 md:w-5 md:h-5 rounded-md bg-white text-[#1e1b4b] text-[9px] md:text-[11px] font-serif font-black">C</span>
              BUDDY PASS
            </span>
            <small className="text-emerald-400 tracking-widest font-extrabold text-[8px] md:text-[9px] flex items-center gap-1 md:gap-1.5">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
            </small>
          </div>

          <div className="relative flex items-center gap-2 md:gap-3 mt-1">
            <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-indigo-500/30 border border-indigo-400/50">🎓</div>
            <div className="min-w-0">
              <h3 className="text-[18px] md:text-[22px] font-serif font-bold text-white leading-none mb-1 truncate">{S.name}</h3>
              <p className="text-[10px] md:text-[11px] text-indigo-300/70">{S.handle} • {S.club}</p>
              <p className="text-[9px] md:text-[10px] text-emerald-300/80 mt-0.5">✓ {S.email.split("@")[1]} confirmed</p>
            </div>
          </div>

          <div className="relative flex-1 grid grid-cols-2 grid-rows-[1.1fr_1fr_1fr] gap-1.5 md:gap-2 mt-2">
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 flex flex-col justify-between">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5 md:gap-2">
                  <b className="text-2xl md:text-3xl text-orange-400 leading-none">{S.trust}</b>
                  <span className="text-[8px] md:text-[9px] text-gray-300 uppercase tracking-widest font-bold">Trust score</span>
                </div>
              </div>
              <div className="h-1 md:h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300" style={{ width: `${S.trust}%` }} />
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 flex flex-col justify-between">
              <span className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">📐 Rentals</span>
              <span className="text-white text-base md:text-lg font-bold leading-none">12/12</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 flex flex-col justify-between">
              <span className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">🏠 Roommate</span>
              <span className="text-white text-base md:text-lg font-bold leading-none">94%</span>
            </div>
            
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 flex items-center justify-between">
              <div>
                <span className="block text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5 md:mb-1">📅 Hack Event</span>
                <span className="text-white text-xs md:text-sm font-semibold">ACIT Hackathon</span>
              </div>
              <span className="text-[8px] md:text-[9px] font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-1.5 py-0.5 md:px-2 md:py-1">TEAM FOUND</span>
            </div>
          </div>

          <div className="relative flex items-center justify-between pt-0.5 mt-auto">
            <div>
              <span className="block text-[7px] md:text-[8px] text-gray-500 uppercase tracking-[0.25em] font-bold">Buddy ID</span>
              <span className="font-mono text-[10px] md:text-[11px] text-indigo-200 tracking-wider">CB·{S.batch.slice(2)}·{S.roll.split("/").pop()}</span>
            </div>
            <MiniQR />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}