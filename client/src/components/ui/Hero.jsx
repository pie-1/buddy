import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TopoBackground } from "./TopoBackground";

export default function Hero() {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Calculate relative position for the mask inside the card
  const maskX = useTransform(smoothX, (x) => {
    if (!cardRef.current) return 0;
    return x - cardRef.current.getBoundingClientRect().left;
  });

  const maskY = useTransform(smoothY, (y) => {
    if (!cardRef.current) return 0;
    return y - cardRef.current.getBoundingClientRect().top;
  });

  // Use a CSS mask instead of clip-path for a softer, glowing edge
  const maskImage = useTransform(
    [maskX, maskY],
    ([x, y]) => `radial-gradient(circle 150px at ${x}px ${y}px, black 30%, transparent 100%)`
  );

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <TopoBackground />

      {/* The Glowing Lens (follows mouse globally) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -z-10 mix-blend-multiply opacity-40"
        style={{
          x: useTransform(smoothX, (x) => x - 250),
          y: useTransform(smoothY, (y) => y - 250),
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
        }}
      />

      <div className="absolute top-24 z-40 px-5 py-2.5 rounded-full bg-indigo-50/90 backdrop-blur-md border border-indigo-100 text-sm font-semibold text-indigo-600 flex items-center gap-2 shadow-sm">
        <span className="text-lg leading-none">✨</span> Move your cursor to scan
      </div>

      {/* The Hanging String */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-gray-300 to-gray-400 z-0" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 border-2 border-white rounded-md shadow-sm z-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
      </div>

      <motion.div 
        ref={cardRef}
        className="relative w-[320px] h-[480px] mt-12 z-20"
        animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        
        {/* LAYER 1: Physical ID */}
        <div className="absolute inset-0 bg-[#f4f3ee] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-200 p-6 flex flex-col z-10">
          <div className="text-center border-b border-gray-300 pb-3 mb-4">
            <b className="text-xs tracking-widest text-gray-800">PURBANCHAL UNIVERSITY</b>
            <small className="block text-[9px] text-gray-500 tracking-widest mt-1">ACME ENGINEERING COLLEGE</small>
          </div>
          
          <div className="w-20 h-24 bg-gray-200 rounded-lg mx-auto mb-4 border border-gray-300 flex items-center justify-center">
             <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Name</label>
            <p className="text-base font-extrabold text-gray-900 leading-none mb-2">Pawan Singh</p>
            
            <div className="flex justify-between">
              <div>
                <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Roll No.</label>
                <p className="font-mono text-sm font-bold text-gray-800">079/BCT/042</p>
              </div>
              <div className="text-right">
                <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Branch</label>
                <p className="text-sm font-bold text-gray-800">B.E. Computer</p>
              </div>
            </div>

            <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-2">University Email</label>
            <p className="font-mono text-sm font-bold text-gray-800">pawan.079@acme.edu.np</p>
          </div>
          
          <div className="mt-auto px-2 py-1.5 text-[10px] text-center text-red-600 bg-red-50 border border-red-200 border-dashed rounded-md font-bold">
            ⚠ LIBRARY DUES PENDING: Rs. 150
          </div>
        </div>

        {/* LAYER 2: Digital Pass (Masked for soft glow) */}
        <motion.div 
          className="absolute inset-0 bg-[#14121f] rounded-2xl p-6 flex flex-col z-20 shadow-[inset_0_0_60px_rgba(99,102,241,0.3)] border border-indigo-500/60"
          style={{ 
            maskImage: maskImage,
            WebkitMaskImage: maskImage // For Safari support
          }}
        >
          <small className="text-emerald-400 tracking-widest font-extrabold text-[10px]">● VERIFIED EDU.NP NODE</small>
          
          <div className="w-16 h-16 mt-6 mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
            🎓
          </div>
          <h3 className="text-2xl font-serif font-bold text-white leading-none mb-1">Pawan Singh</h3>
          <p className="text-xs text-gray-400 mb-6">@pawan • ACME '27</p>
          
          <div className="mt-auto flex flex-col gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md">
              <b className="text-xl text-orange-400 mr-2">92</b> 
              <span className="text-xs text-gray-300">Campus Cred</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md text-xs text-gray-300 flex items-center gap-2">
              <span>🛒</span> The Exchange — Rs. 4,500
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md text-xs text-gray-300 flex items-center gap-2">
              <span>📡</span> The Radar — Hackathon
            </div>
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  );
}