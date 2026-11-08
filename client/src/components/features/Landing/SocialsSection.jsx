// client/src/components/features/Landing/SocialsSection.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { MaskLine, Reveal, EASE } from "./Reveal";
import { TopoBackdrop } from "../../ui/TopoBackdrop";

const WAVE = "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

const CARDS = [
  { from: "#2a2670", to: "#12103a", icon: "📚", tag: "Library, 2 AM", sub: "EXAM SZN", likes: "1.2k", rot: -20, x: -300, y: 80 },
  { from: "#c2570c", to: "#5a230a", icon: "☕", tag: "Chai Point", sub: "5 PM · DAILY", likes: "3.4k", rot: -14, x: -200, y: 40 },
  { from: "#0e7490", to: "#0b3b4d", icon: "💻", tag: "Hack Night", sub: "ACIT · MAR '26", likes: "2.1k", rot: -7, x: -100, y: 10 },
  { from: "#6d3fe0", to: "#25124f", icon: "🎡", tag: "Fest Night", sub: "FEB '26", likes: "8.9k", rot: 0, x: 0, y: 0 },
  { from: "#5a8a14", to: "#243b08", icon: "🏀", tag: "Futsal Fest", sub: "SAT · 8 AM", likes: "1.8k", rot: 7, x: 100, y: 10 },
  { from: "#0f8a67", to: "#07372b", icon: "🤝", tag: "Escrow trade", sub: "VERIFIED", likes: "5.2k", rot: 14, x: 200, y: 40 },
  { from: "#b4235f", to: "#4a0e2a", icon: "🎤", tag: "Open Mic Night", sub: "SUN · 4 PM", likes: "4.7k", rot: 20, x: 300, y: 80 },
];
const SOCIALS = ["LINKEDIN", "TWITTER / X", "INSTAGRAM", "WHATSAPP CHANNEL", "YOUTUBE"];

function PosterArt({ icon }) {
  return (
    <>
      <span className="absolute top-3 right-5 w-16 h-16 rounded-full bg-white/10" />
      <span className="absolute top-5 right-7 w-12 h-12 rounded-full bg-white/20" />
      {[[14, 20], [30, 44], [58, 14], [72, 58], [20, 80], [44, 70]].map(([l, t], i) => (
        <span key={i} className="absolute w-[3px] h-[3px] rounded-full bg-white/40" style={{ left: `${l}%`, top: `${t}px` }} />
      ))}
      <div className="absolute inset-x-0 top-[34%] grid place-items-center text-[44px] drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]">{icon}</div>
      <svg className="absolute inset-x-0 bottom-0 w-full h-[40%]" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
        <path fill="rgba(0,0,0,.42)" d="M0 60V40h10V25h12v20h12V15h12v20h14v15h12V28h16v27h12v5Z" />
        {[[13, 30], [37, 24], [37, 32], [76, 36], [76, 44], [92, 40]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="2" height="2" fill="rgba(253,224,71,.8)" />
        ))}
      </svg>
    </>
  );
}

export default function SocialsSection({ topColor = "#09090b" }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const fanRef = useRef(null);
  const inView = useInView(fanRef, { once: true, margin: "0px 0px -15% 0px" });
  const [entered, setEntered] = useState(false);
  const [hover, setHover] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const sy = useSpring(mouseY, { damping: 30, stiffness: 120 });
  const glowX = useTransform(sx, (v) => v - 300);
  const glowY = useTransform(sy, (v) => v - 300);

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setEntered(true), 1300);
    return () => clearTimeout(id);
  }, [inView]);

  const onMove = (e) => {
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  };

  return (
    <section ref={sectionRef} onMouseMove={onMove} className="relative z-20 bg-[#fafaf8]">
      {topColor && (
        <div className="leading-[0]" style={{ background: topColor }}>
          <svg className="block w-full h-[80px] md:h-[130px] -mb-px" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
            <path fill="#fafaf8" d={WAVE} />
          </svg>
        </div>
      )}

      <div className="relative overflow-hidden pt-24 md:pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, transparent, #000 160px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 160px)" }}>
          <TopoBackdrop className="opacity-70" />
          <motion.div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full will-change-transform" style={{ x: glowX, y: glowY, background: "radial-gradient(circle, rgba(236,72,153,.13), transparent 65%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Reveal as="p" className="text-gray-400 text-[11px] tracking-[0.4em] uppercase font-bold mb-4">The feed</Reveal>
          <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tighter text-[#1a1a2e] leading-none mb-3">
            <MaskLine>WHAT'S UP <span className="text-indigo-600">ON SOCIALS</span></MaskLine>
          </h2>
          <Reveal as="p" delay={0.2} className="text-gray-500 mb-16 md:mb-24">Campus life, as it actually happens.</Reveal>

          <div ref={fanRef} onMouseLeave={() => setHover(null)} className="relative mx-auto flex justify-center items-end h-[330px] mb-16 origin-bottom max-sm:scale-[.5] max-sm:h-[190px] max-sm:mb-6 sm:max-md:scale-[.75] sm:max-md:h-[260px]">
            {CARDS.map((c, i) => {
              const isHover = hover === i;
              const shift = hover === null || isHover ? 0 : i < hover ? -26 : 26;
              const shown = reduce || inView;
              return (
                <motion.div
                  key={c.tag}
                  onMouseEnter={() => setHover(i)}
                  initial={reduce ? false : { opacity: 0, x: 0, y: 160, rotate: 0 }}
                  animate={shown ? { opacity: 1, x: c.x + shift, y: isHover ? c.y - 34 : c.y, rotate: isHover ? c.rot * 0.35 : c.rot, scale: isHover ? 1.06 : 1 } : undefined}
                  transition={{ type: "spring", stiffness: 170, damping: 18, delay: entered || reduce ? 0 : i * 0.08 }}
                  style={{ zIndex: isHover ? 30 : 10 - Math.abs(i - 3), background: `linear-gradient(180deg, ${c.from}, ${c.to})` }}
                  className="absolute bottom-0 w-[160px] h-[240px] rounded-2xl border border-white/10 overflow-hidden origin-bottom cursor-pointer shadow-[0_24px_40px_-14px_rgba(15,10,40,.45)]"
                >
                  <PosterArt icon={c.icon} />
                  <span className="absolute top-3 right-3 text-[9px] font-bold text-white/80 bg-black/25 px-2 py-1 rounded-full">▾ {c.likes}</span>
                  <div className="absolute left-3 bottom-3 text-left">
                    <div className="text-white font-bold text-[13px] leading-tight">{c.tag}</div>
                    <div className="text-white/50 text-[8px] tracking-[0.2em] mt-0.5">{c.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pb-28 md:pb-36">
            <Reveal as="p" className="text-gray-400 text-sm mb-6">Follow the chaos</Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s}
                  href="#"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
                  className="px-5 py-2.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm text-[11px] font-bold tracking-[0.18em] text-gray-700 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}