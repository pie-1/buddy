// client/src/components/ui/HeroCard.jsx
import { motion } from "framer-motion";

export function HeroCard({ cardRef, passRef, scale, y, hintOpacity }) {
  return (
    <motion.div ref={cardRef} style={{ scale, y }} className="relative w-[320px] h-[480px] z-20">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-[13px] font-medium text-indigo-600 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="[@media(hover:none)]:hidden">Move your cursor to scan</span>
          <span className="hidden [@media(hover:none)]:inline">Scroll to unlock your Buddy Pass</span>
        </motion.div>

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-[70vh] bg-gradient-to-b from-transparent via-gray-300 to-gray-400" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-6 rounded-md bg-gray-200 border border-gray-300 shadow-sm grid place-items-center">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
        </div>

        {/* Physical ID */}
        <div className="absolute inset-0 bg-[#f4f3ee] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-[#d6d0c4] p-6 flex flex-col z-10">
          <div className="text-center border-b border-[#d6d0c4]/60 pb-3 mb-4">
            <b className="text-[10px] tracking-widest text-gray-800 uppercase">Purbanchal University</b>
            <small className="block text-[8px] text-gray-500 tracking-widest mt-0.5">ACME ENGINEERING COLLEGE</small>
          </div>
          <div className="w-20 h-24 bg-[#e4e4e7] rounded-lg mx-auto mb-4 border border-[#c4bdaf] flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Name</label>
            <p className="text-base font-extrabold text-gray-900 leading-none mb-3">Pawan Singh</p>
            <div className="flex justify-between">
              <div>
                <label className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Roll No.</label>
                <p className="font-mono text-sm font-bold text-gray-800">079/BCT/042</p>
              </div>
              <div className="text-right">
                <label className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Branch</label>
                <p className="text-sm font-bold text-gray-800">B.E. Computer</p>
              </div>
            </div>
            <label className="text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-3">University Email</label>
            <p className="font-mono text-sm font-bold text-gray-800">pawan.079@acme.edu.np</p>
          </div>
          <div className="mt-auto px-2 py-1.5 text-[9px] text-center text-red-700 bg-red-100 border border-red-200 border-dashed rounded-md font-bold uppercase tracking-wider">
            ⚠ Library Dues Pending: Rs. 150
          </div>
        </div>

        {/* Digital Pass: revealed by the lens, or unlocked by scrolling */}
        <div
          ref={passRef}
          style={{ clipPath: "circle(0px at 0 0)" }}
          className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] to-[#09090b] rounded-2xl p-5 flex flex-col gap-3 z-20 border border-indigo-500/30 shadow-[inset_0_0_80px_rgba(99,102,241,0.2)]"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.2em]">
              <span className="grid place-items-center w-5 h-5 rounded-md bg-white text-[#1e1b4b] text-[11px] font-serif font-black">C</span>
              BUDDY PASS
            </span>
            <small className="text-emerald-400 tracking-widest font-extrabold text-[9px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
            </small>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 border border-indigo-400/50">🎓</div>
            <div>
              <h3 className="text-[22px] font-serif font-bold text-white leading-none mb-1">Pawan Singh</h3>
              <p className="text-[11px] text-indigo-300/70">@pawan • ACIT '27</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 grid-rows-[1.15fr_1fr_1fr] gap-2">
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-baseline gap-2">
                <b className="text-3xl text-orange-400 leading-none">92</b>
                <span className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">Trust score</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-orange-400 to-amber-300" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">📚 Lent out</span>
              <span className="text-white text-lg font-bold leading-none">3 items</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">🏠 Roommate</span>
              <span className="text-white text-lg font-bold leading-none">94% match</span>
            </div>
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">📅 Tonight</span>
                <span className="text-white text-sm font-semibold">ACIT Hack Night · 7 PM</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2 py-1">GOING</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}