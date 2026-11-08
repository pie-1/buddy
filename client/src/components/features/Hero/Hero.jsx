// client/src/components/ui/Hero.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { createTopoField } from "./topoField";
import { blobOutline, outlinePath } from "./blob";
import { HeroCard } from "./HeroCard";

const R = 160;
const CARD_CX = 160;
const CARD_CY = 250;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function Word({ p, range, className = "", children }) {
  const opacity = useTransform(p, range, [0, 1]);
  const y = useTransform(p, range, [36, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

const leftTexts = [
  { title: "Your Campus.", desc: "Verified .edu.np walls — only your college walks in." },
  { title: "Your Circle.", desc: "Find your people across departments and hostels." },
  { title: "Your CollegeBuddy.", desc: "The digital heartbeat of your university life." }
];

const rightTexts = [
  { title: "Connect", desc: "Chat with classmates, seniors, and find roommates." },
  { title: "Collaborate", desc: "Form project teams and share study resources." },
  { title: "Create", desc: "Host events, sell items, and build your campus rep." }
];

export default function Hero() {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const passRef = useRef(null);
  const canvasRef = useRef(null);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const glowSvgRef = useRef(null);
  const auraRef = useRef(null);

  const [hoveredLeft, setHoveredLeft] = useState(null);
  const [hoveredRight, setHoveredRight] = useState(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  const cardScale = useTransform(p, [0, 0.6], [1, 0.62]);
  const cardY = useTransform(p, [0, 0.6], ["0vh", "-12vh"]);
  const hintOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const sideOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const sideShift = useTransform(p, [0, 0.12], [0, -16]);

  useEffect(() => {
    const hero = heroRef.current;
    const card = cardRef.current;
    const pass = passRef.current;
    const fill = fillRef.current;
    const glow = glowRef.current;
    const glowSvg = glowSvgRef.current;
    const auraPath = auraRef.current;
    const field = createTopoField(canvasRef.current);
    const touch = window.matchMedia("(hover: none)").matches;

    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    const lens = { ...m };
    const aura = { ...m };
    const vel = { x: 0, y: 0 };
    const dir = { x: 1, y: 0 };
    const par = { x: 0, y: 0 };
    let on = 0;
    let mouseWant = 0;
    let visible = true;
    let last = performance.now();
    let frame = 0;
    let raf;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(hero);

    const onMove = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      if (!mouseWant) {
        lens.x = aura.x = m.x;
        lens.y = aura.y = m.y;
      }
      mouseWant = 1;
    };
    const onLeave = () => (mouseWant = 0);

    const tick = (ts) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      if (!visible) return;
      const t = ts / 1000;
      const prog = p.get();
      const scrolled = prog > 0.02;
      frame++;

      const h = hero.getBoundingClientRect();
      const c = card.getBoundingClientRect();

      if (touch && !scrolled && !reduce) {
        m.x = c.left + c.width / 2 + Math.sin(t * 0.55) * 90;
        m.y = c.top + c.height / 2 + Math.sin(t * 0.8 + 1) * 120;
        if (!mouseWant) lens.x = aura.x = m.x, (lens.y = aura.y = m.y);
        mouseWant = 1;
      }
      const want = scrolled || reduce ? 0 : mouseWant;

      const px = lens.x;
      const py = lens.y;
      lens.x += (m.x - lens.x) * 0.14;
      lens.y += (m.y - lens.y) * 0.14;
      aura.x += (m.x - aura.x) * 0.07;
      aura.y += (m.y - aura.y) * 0.07;
      par.x += (m.x / innerWidth - 0.5 - par.x) * 0.04;
      par.y += (m.y / innerHeight - 0.5 - par.y) * 0.04;

      vel.x += (lens.x - px - vel.x) * 0.2;
      vel.y += (lens.y - py - vel.y) * 0.2;
      const speed = Math.hypot(vel.x, vel.y);
      if (speed > 0.05) {
        dir.x = vel.x / speed;
        dir.y = vel.y / speed;
      }
      const stretch = Math.min(0.12, speed * 0.008);

      on += (want - on) * 0.09;
      if (on < 0.002) on = 0;

      const unlock = clamp01((prog - 0.08) / 0.4);
      const eased = 1 - Math.pow(1 - unlock, 3);

      if (on > 0.01 && c.top < innerHeight) {
        const r = R * (0.8 + 0.2 * on) * Math.min(1, on * 3);
        const body = blobOutline(r, t, dir.x, dir.y, stretch, 0);
        const trail = blobOutline(r * 1.35, t, dir.x, dir.y, stretch * 1.3, 1.7);
        const o = Math.min(1, on);
        const dHero = outlinePath(body, lens.x - h.left, lens.y - h.top);
        fill.setAttribute("d", dHero);
        glow.setAttribute("d", dHero);
        pass.style.clipPath = `path("${outlinePath(body, lens.x - c.left, lens.y - c.top)}")`;
        glowSvg.style.opacity = o;
        auraPath.setAttribute("d", outlinePath(trail, aura.x - h.left, aura.y - h.top));
        auraPath.style.opacity = o;
      } else {
        fill.setAttribute("d", "");
        auraPath.setAttribute("d", "");
        glowSvg.style.opacity = 0;
        pass.style.clipPath = eased > 0.001 ? `circle(${(eased * 340).toFixed(1)}px at ${CARD_CX}px ${CARD_CY}px)` : "circle(0px at 0 0)";
      }

      if (reduce && frame % 60 !== 1) return;
      field.draw({ t, dt, x: lens.x - h.left, y: lens.y - h.top, speed, on, mx: par.x, my: par.y, flow: prog * 1.6 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      io.disconnect();
      field.destroy();
    };
  }, [p, reduce]);

  return (
    <div ref={containerRef} className="relative w-full h-[260vh] bg-[#fafaf8]">
      <div ref={heroRef} className="sticky top-0 w-full h-screen overflow-hidden isolate flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, rgba(0,0,0,.45) 100%)", WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, rgba(0,0,0,.45) 100%)" }} />

        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <radialGradient id="cb-lens-fill"><stop offset="0" stopColor="#f8f5ff" stopOpacity=".97" /><stop offset="0.8" stopColor="#ede6ff" stopOpacity=".95" /><stop offset="1" stopColor="#e2d8ff" stopOpacity=".35" /></radialGradient>
            <radialGradient id="cb-aura-fill"><stop offset="0" stopColor="rgb(139,92,246)" stopOpacity=".14" /><stop offset="0.6" stopColor="rgb(139,92,246)" stopOpacity=".09" /><stop offset="1" stopColor="rgb(139,92,246)" stopOpacity="0" /></radialGradient>
          </defs>
          <path ref={auraRef} fill="url(#cb-aura-fill)" />
          <path ref={fillRef} fill="url(#cb-lens-fill)" />
        </svg>

        <svg ref={glowSvgRef} className="absolute inset-0 w-full h-full z-30 pointer-events-none opacity-0">
          <defs><path ref={glowRef} id="cb-lens-edge" fill="none" /></defs>
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.02)" strokeWidth="44" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.03)" strokeWidth="26" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.05)" strokeWidth="10" strokeLinejoin="round" />
        </svg>

        <HeroCard cardRef={cardRef} passRef={passRef} scale={cardScale} y={cardY} hintOpacity={hintOpacity} />

        <h1 className="absolute top-[70%] left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap font-serif font-bold tracking-tight text-[#1a1a2e] text-[44px] sm:text-7xl lg:text-[112px] leading-none">
          <Word p={p} range={[0.3, 0.5]}>connect.</Word>{" "}
          <Word p={p} range={[0.42, 0.62]}>buy.</Word>{" "}
          <Word p={p} range={[0.54, 0.76]} className="italic text-indigo-600">belong.</Word>
        </h1>

        {/* Side Text with Hover Descriptions */}
        <motion.div
          style={{ opacity: sideOpacity, y: sideShift }}
          className="absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-12 md:px-24 max-w-[1500px] mx-auto w-full"
        >
          <div className="hidden md:flex flex-col items-start gap-16 pointer-events-auto">
            {leftTexts.map((item, i) => (
              <div
                key={item.title}
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredLeft(i)}
                onMouseLeave={() => setHoveredLeft(null)}
              >
                <span className="relative z-10 text-[2.5rem] font-serif font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </span>
                <div className="absolute -bottom-4 left-0 w-16 h-[2px] bg-gray-300 group-hover:bg-indigo-300 transition-colors" />
                <AnimatePresence>
                  {hoveredLeft === i && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full mt-6 w-64 text-sm font-sans font-medium text-gray-500 leading-relaxed">
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-col items-end gap-16 pointer-events-auto">
            {rightTexts.map((item, i) => (
              <div
                key={item.title}
                className="relative cursor-pointer text-right group"
                onMouseEnter={() => setHoveredRight(i)}
                onMouseLeave={() => setHoveredRight(null)}
              >
                <span className="relative z-10 text-[2.5rem] font-serif font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </span>
                <div className="absolute -bottom-4 right-0 w-16 h-[2px] bg-gray-300 group-hover:bg-indigo-300 transition-colors" />
                <AnimatePresence>
                  {hoveredRight === i && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full mt-6 right-0 w-64 text-sm font-sans font-medium text-gray-500 leading-relaxed">
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}