// client/src/components/features/Hero/Hero.jsx
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { createTopoField } from "./topoField";
import { blobOutline, outlinePath } from "./blob";
import { HeroCard } from "./HeroCard";

const R = 160;
const CARD_CX = 160;
const CARD_CY = 250;
const EASE = [0.22, 1, 0.36, 1];
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function Word({ p, range, className = "", children }) {
  const opacity = useTransform(p, range, [0, 1]);
  const y = useTransform(p, range, [44, 0]);
  const blur = useTransform(p, range, [10, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.span style={{ opacity, y, filter }} className={`relative inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

function Scribble({ p, range }) {
  const pathLength = useTransform(p, range, [0, 1]);
  return (
    <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute left-[2%] -bottom-[0.06em] h-[0.12em] w-[96%] overflow-visible text-indigo-400/70">
      <motion.path d="M2 9 C 34 3, 62 13, 100 7 S 168 4, 198 8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" style={{ pathLength }} />
    </svg>
  );
}

const LEFT = [
  { title: "Your Campus.", desc: "Only verified .edu.np emails get in. No fake profiles, no random strangers." },
  { title: "Your Circle.", desc: "Seniors, batchmates and hostel neighbours, all in one place." },
  { title: "Your CollegeBuddy.", desc: "The one app your whole college actually uses." },
];
const RIGHT = [
  { title: "Connect", desc: "Chat with classmates. Ask the senior who already cleared that subject." },
  { title: "Collaborate", desc: "Find teammates for the project. Share notes before the exam." },
  { title: "Create", desc: "Sell your old drafter, host an event, make a name on campus." },
];

function SideList({ items, align, x, enabled }) {
  const [open, setOpen] = useState(null);
  const right = align === "right";
  return (
    <motion.ul style={{ x }} className={`hidden lg:flex flex-col gap-14 ${right ? "items-end text-right" : "items-start text-left"}`}>
      {items.map((item, i) => {
        const on = open === i && enabled;
        return (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, x: right ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 + i * 0.12 }}
            className={`relative ${enabled ? "pointer-events-auto" : "pointer-events-none"}`}
            onMouseEnter={() => setOpen(i)}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              tabIndex={enabled ? 0 : -1}
              onFocus={() => setOpen(i)}
              onBlur={() => setOpen(null)}
              aria-expanded={on}
              className={`group relative flex flex-col outline-none ${right ? "items-end" : "items-start"}`}
            >
              <span className="mb-1.5 font-mono text-[10px] tracking-[0.25em] text-gray-400 transition-colors duration-300 group-hover:text-indigo-500 group-focus-visible:text-indigo-500">
                0{i + 1}
              </span>
              <span className="font-serif text-[2rem] xl:text-[2.5rem] font-bold leading-[1.05] text-gray-900 transition-colors duration-300 group-hover:text-indigo-600 group-focus-visible:text-indigo-600">
                {item.title}
              </span>
              <span className={`mt-3 h-[2px] bg-gray-300 transition-all duration-500 group-hover:w-24 group-hover:bg-indigo-400 group-focus-visible:w-24 group-focus-visible:bg-indigo-400 ${on ? "w-24 bg-indigo-400" : "w-12"}`} />
            </button>
            <AnimatePresence>
              {on && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`absolute top-full mt-4 w-64 text-[13px] font-medium leading-relaxed text-gray-500 ${right ? "right-0" : "left-0"}`}
                >
                  {item.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

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

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  const short = typeof window !== "undefined" && window.innerHeight < 700;
  const cardScale = useTransform(p, [0, 0.45, 0.8], [1, 0.74, short ? 0.42 : 0.5]);
  const cardY = useTransform(p, [0, 0.45, 0.8], ["0vh", "-6vh", short ? "-24vh" : "-18vh"]);
  const cardOpacity = useTransform(p, [0.88, 1], [1, 0.75]);
  const hintOpacity = useTransform(p, [0, 0.04], [1, 0]);
  const cueOpacity = useTransform(p, [0.02, 0.07], [1, 0]);
  const sideOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const leftX = useTransform(p, [0, 0.1], [0, -48]);
  const rightX = useTransform(p, [0, 0.1], [0, 48]);
  const moreOpacity = useTransform(p, [0.9, 0.97], [0, 1]);

  const [sideOn, setSideOn] = useState(true);
  useMotionValueEvent(p, "change", (v) => {
    setSideOn(v < 0.08);
  });

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
    let seen = false;
    let demoFrom = null;
    let visible = true;
    let last = performance.now();
    let frame = 0;
    let raf;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(hero);

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      seen = true;
      m.x = e.clientX;
      m.y = e.clientY;
      if (!mouseWant) { lens.x = aura.x = m.x; lens.y = aura.y = m.y; }
      mouseWant = 1;
    };
    const onLeave = () => (mouseWant = 0);
    const onClick = (e) => {
      if (e.target.closest?.("a,button")) return;
      const rect = canvasRef.current.getBoundingClientRect();
      field.pulse(e.clientX - rect.left, e.clientY - rect.top);
    };

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

      let auto = touch;
      if (!touch && !seen && !scrolled) {
        if (demoFrom === null && ts > 1700) demoFrom = t;
        if (demoFrom !== null) {
          auto = t - demoFrom < 7;
          if (!auto && mouseWant) mouseWant = 0;
        }
      }
      if (auto && !scrolled && !reduce) {
        const k = demoFrom === null ? t : t - demoFrom;
        m.x = c.left + c.width / 2 + Math.sin(k * 0.55) * 90;
        m.y = c.top + c.height / 2 + Math.sin(k * 0.8 + 1) * 120;
        if (!mouseWant) { lens.x = aura.x = m.x; lens.y = aura.y = m.y; }
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
      if (speed > 0.05) { dir.x = vel.x / speed; dir.y = vel.y / speed; }
      const stretch = Math.min(0.12, speed * 0.008);

      on += (want - on) * 0.09;
      if (on < 0.002) on = 0;

      const unlock = clamp01((prog - 0.06) / 0.39);
      const eased = 1 - Math.pow(1 - unlock, 3);

      if (on > 0.01 && c.top < innerHeight) {
        const r = R * (0.8 + 0.2 * on) * Math.min(1, on * 3);
        const body = blobOutline(r, t, dir.x, dir.y, stretch, 0);
        const trail = blobOutline(r * 1.35, t, dir.x, dir.y, stretch * 1.3, 1.7);
        const o = Math.min(1, on);
        fill.setAttribute("d", outlinePath(body, lens.x - h.left, lens.y - h.top));
        glow.setAttribute("d", outlinePath(body, lens.x - h.left, lens.y - h.top));
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

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      io.disconnect();
      field.destroy();
    };
  }, [p, reduce]);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-[#fafaf8]">
      <div ref={heroRef} className="sticky top-0 isolate flex h-screen w-full flex-col items-center justify-center overflow-hidden pt-20">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, rgba(0,0,0,.45) 100%)", WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, rgba(0,0,0,.45) 100%)" }}
        />

        <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full">
          <defs>
            <radialGradient id="cb-lens-fill"><stop offset="0" stopColor="#f8f5ff" stopOpacity=".97" /><stop offset="0.8" stopColor="#ede6ff" stopOpacity=".95" /><stop offset="1" stopColor="#e2d8ff" stopOpacity=".35" /></radialGradient>
            <radialGradient id="cb-aura-fill"><stop offset="0" stopColor="rgb(139,92,246)" stopOpacity=".14" /><stop offset="0.6" stopColor="rgb(139,92,246)" stopOpacity=".09" /><stop offset="1" stopColor="rgb(139,92,246)" stopOpacity="0" /></radialGradient>
          </defs>
          <path ref={auraRef} fill="url(#cb-aura-fill)" />
          <path ref={fillRef} fill="url(#cb-lens-fill)" />
        </svg>

        <svg ref={glowSvgRef} aria-hidden className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-0">
          <defs><path ref={glowRef} id="cb-lens-edge" fill="none" /></defs>
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.02)" strokeWidth="44" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.03)" strokeWidth="26" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.05)" strokeWidth="10" strokeLinejoin="round" />
        </svg>

        <motion.div style={{ opacity: cardOpacity }} className="relative z-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 11, mass: 0.9, delay: 0.1 }}
          >
            <HeroCard cardRef={cardRef} passRef={passRef} scale={cardScale} y={cardY} hintOpacity={hintOpacity} />
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-4 pb-8 sm:pb-12">
          <h1 className="text-center font-serif font-bold leading-[1.05] tracking-tight text-[#1a1a2e] text-[clamp(30px,8.6vw,96px)] sm:whitespace-nowrap">
            <span className="sr-only">CollegeBuddy: the verified campus network for Nepali college students. </span>
            <span aria-hidden>
              <Word p={p} range={[0.4, 0.56]}>connect.</Word>{" "}
              <Word p={p} range={[0.48, 0.64]}>buy.</Word>{" "}
              <Word p={p} range={[0.56, 0.74]} className="italic text-indigo-600">
                belong.
                <Scribble p={p} range={[0.7, 0.82]} />
              </Word>
            </span>
          </h1>

          <motion.div aria-hidden style={{ opacity: moreOpacity }} className="mt-6 hidden flex-col items-center gap-1.5 text-gray-400 [@media(min-height:760px)]:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">The story continues</span>
            <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={reduce ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <path d="M2 4.5 7 9.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.div>
        </div>

        <motion.div aria-hidden style={{ opacity: cueOpacity }} className="pointer-events-none absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 [@media(min-height:700px)]:flex">
          <div className="flex h-[34px] w-[20px] justify-center rounded-full border-[1.5px] border-gray-400/60 pt-1.5">
            <motion.span animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="h-1 w-1 rounded-full bg-gray-500" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Scroll</span>
        </motion.div>

        <motion.div style={{ opacity: sideOpacity }} className="pointer-events-none absolute inset-0 z-40 mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 pt-20 sm:px-12 md:px-24">
          <SideList items={LEFT} align="left" x={leftX} enabled={sideOn} />
          <SideList items={RIGHT} align="right" x={rightX} enabled={sideOn} />
        </motion.div>
      </div>
    </div>
  );
}