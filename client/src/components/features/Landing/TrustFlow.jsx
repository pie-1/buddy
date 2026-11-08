// client/src/components/features/Landing/TrustFlow.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { IdFace, PassFace } from "../../ui/CardFaces";

const MARQUEE_1 = "TRUST • TAP • TRADE • ";
const MARQUEE_2 = "REAL PEOPLE • JUST YOUR CAMPUS • TRUSTED • ";

const FIXES = [
  { id: "01", title: "Escrow-protected trades", desc: "Money stays locked until both sides tap done. Scammers starve.", icon: "🛡️", color: "text-red-400" },
  { id: "02", title: "The Radar", desc: "One feed for everything on campus. Zero group-chat archaeology.", icon: "📡", color: "text-cyan-400" },
  { id: "03", title: "Verified peers, real help", desc: "Ask, borrow, study together. Ghost Mode until you're ready.", icon: "🤝", color: "text-orange-400" },
];

function useIsMd() {
  const [md, setMd] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setMd(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return md;
}

function Marquee({ text, outline = false, reverse = false, speed = 25, paused }) {
  return (
    <div className="w-[110%] -ml-[5%] overflow-hidden whitespace-nowrap border-y border-white/10 py-3 md:py-5 bg-[#0c0b14]">
      <motion.div
        animate={paused ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
        className={`flex w-max text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter ${outline ? "text-transparent" : "text-orange-500"}`}
        style={outline ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.7)" } : undefined}
      >
        <span className="flex shrink-0">{text.repeat(8)}</span>
        <span className="flex shrink-0">{text.repeat(8)}</span>
      </motion.div>
    </div>
  );
}

function FixCard({ p, fix, start }) {
  const opacity = useTransform(p, [start, start + 0.07], [0, 1]);
  const y = useTransform(p, [start, start + 0.07], [28, 0]);
  const x = useTransform(p, [start, start + 0.07], [24, 0]);
  return (
    <motion.div style={{ opacity, y, x }} className="bg-[#14121f]/90 border border-white/10 rounded-xl p-4 md:p-5 flex gap-4 backdrop-blur-sm">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 grid place-items-center text-xl">{fix.icon}</div>
      <div>
        <div className={`text-[9px] font-bold tracking-widest uppercase mb-1 ${fix.color}`}>Fixes {fix.id}</div>
        <h4 className="text-white font-bold text-sm mb-1">{fix.title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed">{fix.desc}</p>
      </div>
    </motion.div>
  );
}

export function TrustFlow() {
  const reduce = useReducedMotion();
  const md = useIsMd();
  const ref = useRef(null);
  const [verified, setVerified] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });

  useMotionValueEvent(p, "change", (v) => setVerified(v > 0.62));

  const wordBlur = useTransform(p, [0, 0.08, 0.32], ["blur(1.5px)", "blur(2px)", "blur(20px)"]);
  const wordOpacity = useTransform(p, [0, 0.2, 0.4], [1, 0.45, 0]);
  const wordScale = useTransform(p, [0, 0.4], [1, 1.12]);
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);

  const cardY = useTransform(p, [0.05, 0.3, 0.4, 0.56], ["-75vh", "0vh", "0vh", md ? "0vh" : "-16vh"]);
  const cardRotate = useTransform(p, [0.05, 0.16, 0.24, 0.32, 0.38], [0, 4, -2.5, 0.8, 0]);
  const cardScale = useTransform(p, [0.05, 0.3, 0.4, 0.56], [0.8, md ? 0.95 : 0.8, md ? 0.95 : 0.8, md ? 0.62 : 0.5]);
  const cardX = useTransform(p, [0.4, 0.56], ["0vw", md ? "-26vw" : "0vw"]);
  const stringOpacity = useTransform(p, [0.42, 0.52], [1, 0]);

  const boxOpacity = useTransform(p, [0.5, 0.56, 0.74, 0.8], [0, 1, 1, 0]);
  const boxY = useTransform(p, [0.5, 0.56], [24, 0]);

  const passClip = useTransform(p, [0.66, 0.78], ["circle(0% at 50% 50%)", "circle(80% at 50% 50%)"]);
  const cardShadow = useTransform(p, [0.64, 0.8], ["0 30px 60px -15px rgba(0,0,0,0.55)", "0 0 90px rgba(99,102,241,0.55)"]);

  const bandOpacity = useTransform(p, [0.7, 0.78], [0, 1]);
  const bandTopY = useTransform(p, [0.7, 0.78], [-50, 0]);
  const bandBotY = useTransform(p, [0.7, 0.78], [50, 0]);
  const fixesOpacity = useTransform(p, [0.76, 0.82], [0, 1]);

  return (
    <div ref={ref} data-nav-theme="dark" className="relative z-20 w-full h-[520vh] bg-[#09090b] text-white">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 105%, rgba(79,70,229,.22), transparent 70%), radial-gradient(ellipse 50% 40% at 50% 40%, rgba(99,102,241,.08), transparent 70%)" }} />

        <motion.div style={{ opacity: wordOpacity, scale: wordScale, filter: wordBlur }} className="absolute z-0 text-center px-4 will-change-[filter]">
          <p className="text-gray-500 text-xs tracking-[0.45em] uppercase font-bold mb-5">But wait…</p>
          <h2 className="text-[13vw] md:text-[9vw] leading-none font-sans font-black uppercase tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-orange-400 bg-clip-text text-transparent">CollegeBuddy</h2>
          <p className="text-gray-400 mt-5 text-lg md:text-2xl">is here to fix <b className="text-white">all of it.</b></p>
        </motion.div>
        <motion.p style={{ opacity: hintOpacity }} className="absolute bottom-[12%] z-10 text-[10px] tracking-[0.4em] uppercase font-bold text-gray-600">Keep scrolling · watch your ID</motion.p>

        <motion.div style={{ y: cardY, x: cardX, scale: cardScale, rotate: cardRotate, transformOrigin: "50% -20px" }} className="absolute z-20 w-[320px] h-[480px]">
          <motion.div style={{ opacity: stringOpacity }} className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-gray-600 to-gray-400" />
          <motion.div style={{ opacity: stringOpacity }} className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-6 rounded-md bg-gray-300 border border-gray-400 shadow-sm grid place-items-center">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
          </motion.div>

          <motion.div style={{ boxShadow: cardShadow }} className="absolute inset-0 rounded-2xl">
            <IdFace />
            <motion.div style={{ clipPath: passClip }} className="absolute inset-0 rounded-2xl">
              <PassFace />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: boxOpacity, y: boxY }} className="absolute z-20 left-1/2 md:ml-[7vw] -translate-x-1/2 md:translate-x-0 top-[68%] md:top-1/2 md:-translate-y-1/2 w-[min(360px,86vw)]">
          <div className={`rounded-2xl border bg-[#14121f] p-5 md:p-6 transition-all duration-700 ${verified ? "border-emerald-400/50 shadow-[0_0_40px_-6px_rgba(52,211,153,.35)]" : "border-white/10 shadow-2xl"}`}>
            <div className="text-[10px] text-gray-500 tracking-[0.3em] uppercase mb-2">University e-mail</div>
            <div className="font-mono text-lg md:text-xl text-white">pawan.079@<span className="text-orange-400">acme.edu.np</span></div>
          </div>
          <div className="mt-4 h-6 pl-1 flex items-center text-xs font-bold tracking-[0.3em]">
            {verified ? (
              <motion.span initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-emerald-400">
                <span className="w-6 h-6 rounded-full bg-emerald-400 grid place-items-center text-black text-[11px]">✓</span>
                VERIFIED
                <span className="text-[9px] text-gray-500 tracking-[0.25em] font-medium">· CAMPUS NODE ACTIVE</span>
              </motion.span>
            ) : (
              <span className="text-gray-500 animate-pulse">VERIFYING..</span>
            )}
          </div>
        </motion.div>

        <motion.div style={{ opacity: bandOpacity }} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-[3vh] z-30">
          <motion.div style={{ y: bandTopY }} className="-rotate-2"><Marquee text={MARQUEE_1} outline speed={30} paused={reduce} /></motion.div>
          <motion.div style={{ y: bandBotY }} className="rotate-2"><Marquee text={MARQUEE_2} reverse speed={25} paused={reduce} /></motion.div>
        </motion.div>

        <motion.div style={{ opacity: fixesOpacity }} className="absolute z-20 flex flex-col gap-3 md:gap-4 w-[min(440px,88vw)] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-1/2 md:ml-[6vw] top-1/2 -translate-y-1/2 max-md:top-[56%]">
          <p className="text-indigo-400 text-[10px] tracking-[0.35em] uppercase font-bold">One pass. Three fixes.</p>
          {FIXES.map((f, i) => (
            <FixCard key={f.id} p={p} fix={f} start={0.78 + i * 0.06} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}