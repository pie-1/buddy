import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SCAN_RADIUS = 140;

export default function Hero() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // 1. Canvas Background renderer (Draws topo.svg natively, no CORS issues)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "/topo.svg"; // Ensure topo.svg is in client/public/

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Draw the image scaled to cover the screen
      ctx.globalAlpha = 0.3; // Opacity of the map
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.onload = draw;
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  // 2. Mouse tracking (Lerp for smoothness)
  useEffect(() => {
    const card = cardRef.current;
    const target = { x: -1000, y: -1000 };
    const pos = { x: -1000, y: -1000 };
    let raf;
    let started = false;

    const onMove = (e) => {
      if (!started) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        started = true;
      }
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;

      if (card) {
        const c = card.getBoundingClientRect();
        // Update the CSS variable used by the clip-path
        card.style.setProperty("--cx", `${pos.x - c.left}px`);
        card.style.setProperty("--cy", `${pos.y - c.top}px`);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#fafaf8]">
      
      {/* 1. STATIC BACKGROUND CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* 2. THE CARD */}
      <motion.div
        ref={cardRef}
        className="relative w-[320px] h-[480px] z-20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Hint Pill */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-5 py-2.5 rounded-full bg-indigo-50/90 backdrop-blur-md border border-indigo-100 text-sm font-semibold text-indigo-600 flex items-center gap-2 shadow-sm">
          <span className="text-lg leading-none">✨</span> Move your cursor to scan
        </div>

        {/* Hanging String */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-[70vh] bg-gradient-to-b from-transparent via-gray-300 to-gray-400" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-6 rounded-md bg-gray-200 border border-gray-300 shadow-sm grid place-items-center">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
        </div>

        {/* LAYER 1: Physical ID (Warm Beige) */}
        <div className="absolute inset-0 bg-[#e8e4d9] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-[#d6d0c4] p-6 flex flex-col z-10">
          <div className="text-center border-b border-[#d6d0c4] pb-3 mb-4">
            <b className="text-xs tracking-widest text-gray-800">PURBANCHAL UNIVERSITY</b>
            <small className="block text-[9px] text-gray-500 tracking-widest mt-1">ACME ENGINEERING COLLEGE</small>
          </div>

          <div className="w-20 h-24 bg-[#d6d0c4] rounded-lg mx-auto mb-4 border border-[#c4bdaf] flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Name</label>
            <p className="text-base font-extrabold text-gray-900 leading-none mb-2">Pawan Singh</p>

            <div className="flex justify-between">
              <div>
                <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Roll No.</label>
                <p className="font-mono text-sm font-bold text-gray-800">079/BCT/042</p>
              </div>
              <div className="text-right">
                <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Branch</label>
                <p className="text-sm font-bold text-gray-800">B.E. Computer</p>
              </div>
            </div>

            <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-2">University Email</label>
            <p className="font-mono text-sm font-bold text-gray-800">pawan.079@acme.edu.np</p>
          </div>

          <div className="mt-auto px-2 py-1.5 text-[10px] text-center text-red-700 bg-red-100 border border-red-200 border-dashed rounded-md font-bold">
            ⚠ LIBRARY DUES PENDING: Rs. 150
          </div>
        </div>

        {/* LAYER 2: Digital Pass (Clip-path Scanner) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] to-[#09090b] rounded-2xl p-6 flex flex-col z-20 border border-indigo-500/60 shadow-[inset_0_0_60px_rgba(99,102,241,0.2)]"
          style={{ 
            clipPath: `circle(${SCAN_RADIUS}px at var(--cx, -999px) var(--cy, -999px))` 
          }}
        >
          <small className="text-emerald-400 tracking-widest font-extrabold text-[10px]">● VERIFIED ACIT NODE</small>

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
        </div>
      </motion.div>
    </section>
  );
}