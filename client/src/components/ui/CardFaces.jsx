// client/src/components/ui/CardFaces.jsx
// The two faces of the same card: the plain university ID and the Buddy Pass it turns into.
export function IdFace() {
  return (
    <div className="absolute inset-0 bg-[#f4f3ee] rounded-2xl border border-[#d6d0c4] p-6 flex flex-col">
      <div className="text-center border-b border-[#d6d0c4]/60 pb-3 mb-4">
        <b className="text-[10px] tracking-widest text-gray-800 uppercase">Purbanchal University</b>
        <small className="block text-[8px] text-gray-500 tracking-widest mt-0.5">ACME ENGINEERING COLLEGE</small>
      </div>
      <div className="w-20 h-24 bg-[#e4e4e7] rounded-lg mx-auto mb-4 border border-[#c4bdaf] grid place-items-center shadow-inner">
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Name</span>
        <p className="text-base font-extrabold text-gray-900 leading-none mb-3">Pawan Singh</p>
        <div className="flex justify-between">
          <div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Roll No.</span>
            <p className="font-mono text-sm font-bold text-gray-800">079/BCT/042</p>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Branch</span>
            <p className="text-sm font-bold text-gray-800">B.E. Computer</p>
          </div>
        </div>
        <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-3">University Email</span>
        <p className="font-mono text-sm font-bold text-gray-800">pawan.079@acme.edu.np</p>
      </div>
      <div className="mt-auto px-2 py-1.5 text-[9px] text-center text-red-700 bg-red-100 border border-red-200 border-dashed rounded-md font-bold uppercase tracking-wider">
        ⚠ Library Dues Pending: Rs. 150
      </div>
    </div>
  );
}

export function PassFace() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#26226b] to-[#0c0b18] rounded-2xl p-5 flex flex-col gap-3 border border-indigo-400/40">
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
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-2xl shadow-lg shadow-indigo-500/30 border border-indigo-400/50">🎓</div>
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
  );
}