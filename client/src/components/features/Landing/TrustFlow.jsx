// client/src/components/ui/TrustFlow.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const MARQUEE_1 = "TRUST • TAP • TRADE • ";
const MARQUEE_2 = "REAL PEOPLE • JUST YOUR CAMPUS • TRUSTED • ";

const FIXES = [
  { id: "01", title: "Escrow-protected trades", desc: "Money stays locked until both sides tap done. Scammers starve.", icon: "🛡️", color: "text-red-400" },
  { id: "02", title: "The Radar", desc: "One feed for everything on campus. Zero group-chat archaeology.", icon: "📡", color: "text-cyan-400" },
  { id: "03", title: "Verified peers, real help", desc: "Ask, borrow, study together — Ghost Mode until you're ready.", icon: "🤝", color: "text-orange-400" }
];

function Marquee({ text, outline = false, reverse = false, speed = 25 }) {
  return (
    <div className="w-[110%] -ml-[5%] overflow-hidden whitespace-nowrap border-y border-white/10 py-5 bg-[#09090b]">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
        className={`flex text-6xl md:text-8xl font-sans font-black uppercase tracking-tighter ${outline ? "text-transparent" : "text-orange-500"}`}
        style={outline ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.7)" } : {}}
      >
        <span className="flex shrink-0">{text.repeat(8)}</span>
        <span className="flex shrink-0">{text.repeat(8)}</span>
      </motion.div>
    </div>
  );
}

export function TrustFlow() {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);

  // 500vh gives us plenty of scroll distance to sequence the animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- Timeline Map ---
  // 0.0 - 0.2: "BUT WAIT" text
  // 0.2 - 0.4: Card zooms to center
  // 0.4 - 0.6: Card moves left, Email Verify appears
  // 0.6 - 1.0: Marquees appear, Fixes pop in one by one

  // "BUT WAIT" Text
  const butWaitOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Card animations
  const cardScale = useTransform(scrollYProgress, [0.1, 0.35], [0.6, 1.1]);
  const cardX = useTransform(scrollYProgress, [0.4, 0.6], ["0%", "-25%"]);
  const cardBlurOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);

  // Email Verify Box
  const verifyOpacity = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);
  const verifyY = useTransform(scrollYProgress, [0.4, 0.45], [20, 0]);
  const verifiedState = useTransform(scrollYProgress, (v) => v > 0.5);

  // Marquees & Fixes
  const marqueeOpacity = useTransform(scrollYProgress, [0.55, 0.6], [0, 1]);
  const fix1Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const fix2Opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const fix3Opacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  // The box on the right side that switches from verify to fixes
  const rightBoxOpacity = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#09090b] text-white">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Background Blur Text */}
        <motion.div style={{ opacity: cardBlurOpacity }} className="absolute inset-0 flex items-center justify-center z-0">
          <h2 className="text-[150px] md:text-[250px] font-sans font-black text-white/5 blur-sm select-none">
            BUDDY
          </h2>
        </motion.div>

        {/* 1. BUT WAIT Text */}
        <motion.div style={{ opacity: butWaitOpacity }} className="absolute z-10 text-center">
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase font-bold mb-4">But wait...</p>
          <h2 className="text-5xl md:text-7xl font-sans font-black text-white/80">CollegeBuddy</h2>
          <p className="text-gray-400 mt-4 text-sm tracking-widest">IS HERE TO FIX ALL OF IT</p>
        </motion.div>

        {/* 2. The Main Content Grid */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex items-center justify-center">
          
          {/* Left Side: ID Card */}
          <motion.div 
            style={{ scale: cardScale, x: cardX }}
            className="relative w-[320px] h-[480px] shrink-0"
          >
            {/* Digital Pass Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] to-[#09090b] rounded-2xl p-6 flex flex-col gap-4 border border-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.3)]">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-bold tracking-[0.2em]">BUDDY PASS</span>
                <small className="text-emerald-400 font-extrabold text-[10px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED
                </small>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-500 flex items-center justify-center text-3xl shadow-lg">🎓</div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">Pawan Singh</h3>
                  <p className="text-xs text-indigo-300">@pawan • ACME '27</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Trust Score</span>
                  <span className="text-orange-400 font-bold text-xl">92</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Roommate</span>
                  <span className="text-white font-bold text-xl">94%</span>
                </div>
              </div>
              
              <div className="mt-auto text-center border-t border-white/10 pt-4">
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">Campus Node Active</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Verify Box (Fades out) & Fixes (Fade in) */}
          <div className="relative flex-1 flex flex-col pl-12 md:pl-24">
            
            {/* Email Verify Box */}
            <motion.div 
              style={{ opacity: rightBoxOpacity, y: verifyY }}
              className="absolute top-1/2 -translate-y-1/2 bg-[#14121f] border border-white/10 rounded-xl p-6 shadow-2xl w-[350px]"
            >
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">University E-mail</div>
              <div className="text-xl font-mono text-orange-400 mb-4">pawan.079@acme.edu.np</div>
              
              <div className="flex items-center gap-2 text-xs font-bold">
                {useTransform(scrollYProgress, (v) => v > 0.5) ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <span className="w-4 h-4 bg-emerald-400 rounded-full grid place-items-center text-black text-[9px]">✓</span>
                    VERIFIED — CAMPUS NODE ACTIVE
                  </span>
                ) : (
                  <span className="text-gray-400 animate-pulse tracking-widest">VERIFYING...</span>
                )}
              </div>
            </motion.div>

            {/* Fixes List */}
            <motion.div style={{ opacity: marqueeOpacity }} className="flex flex-col gap-4 max-w-md">
              <p className="text-indigo-400 text-[10px] tracking-[0.3em] uppercase font-bold mb-2">One pass. Three fixes.</p>
              
              {FIXES.map((fix, i) => (
                <motion.div
                  key={fix.id}
                  style={{ 
                    opacity: i === 0 ? fix1Opacity : i === 1 ? fix2Opacity : fix3Opacity,
                    y: useTransform(scrollYProgress, [0.6 + i * 0.1, 0.7 + i * 0.1], [20, 0])
                  }}
                  className="bg-[#14121f] border border-white/10 rounded-xl p-5 flex gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl`}>{fix.icon}</div>
                  <div>
                    <div className={`text-[9px] font-bold tracking-widest uppercase mb-1 ${fix.color}`}>FIXES {fix.id}</div>
                    <h4 className="text-white font-bold text-sm mb-1">{fix.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{fix.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 3. The Marquees (Top and Bottom) */}
        <motion.div style={{ opacity: marqueeOpacity }} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-12 z-30">
          <div className="-rotate-2">
            <Marquee text={MARQUEE_1} outline={true} speed={30} />
          </div>
          <div className="rotate-2">
            <Marquee text={MARQUEE_2} reverse={true} speed={25} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}