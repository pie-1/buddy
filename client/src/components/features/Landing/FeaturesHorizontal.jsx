// client/src/components/features/Landing/FeaturesHorizontal.jsx
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// `peek` is a tiny real-life sample of what you will find inside, so each card shows instead of only telling.
const FEATURES = [
  {
    id: "01",
    to: "/marketplace",
    tag: "MARKETPLACE",
    dot: "bg-indigo-400",
    tagColor: "text-indigo-300 border-indigo-400/30 bg-indigo-400/10",
    glow: "99,102,241",
    title: "Don't buy new. Borrow smart.",
    desc: "Need a drafter for just one semester? Rent it from a senior. Sell last year's books. Your money stays safe until you both say “done”.",
    icon: "🛍️",
    peek: "📐 Drafter set · Rs. 150 / semester",
    tags: ["Escrow protected", "Verified students"],
    cta: "Browse the marketplace",
  },
  {
    id: "02",
    to: "/events",
    tag: "EVENTS",
    dot: "bg-orange-400",
    tagColor: "text-orange-300 border-orange-400/30 bg-orange-400/10",
    glow: "249,115,22",
    title: "Never hear “it was yesterday”.",
    desc: "Hackathons, futsal, fests and open mics from every college, in one feed. Know first, show up first.",
    icon: "📡",
    peek: "⚡ Hackathon · Friday, 7 PM · 2 seats left",
    tags: ["Hackathons", "Fests"],
    cta: "See what's on",
  },
  {
    id: "03",
    to: "/roommates",
    tag: "ROOMMATES",
    dot: "bg-green-400",
    tagColor: "text-green-300 border-green-400/30 bg-green-400/10",
    glow: "74,222,128",
    title: "A flatmate who gets you.",
    desc: "Match on budget, area and habits (yes, the 2 AM kind). See rooms on a map instead of scrolling a group chat.",
    icon: "🏠",
    peek: "📍 Kalanki · Rs. 6,500 / month · night owl okay",
    tags: ["Map view", "Habit match"],
    cta: "Find a room",
  },
  {
    id: "04",
    to: "/connect",
    tag: "CONNECT",
    dot: "bg-cyan-400",
    tagColor: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
    glow: "34,211,238",
    title: "Your team is one tap away.",
    desc: "Need a coder for your hackathon? A CS senior to ask “is this normal?” Reach people across departments and alumni.",
    icon: "🤝",
    peek: "💬 “Need one React dev for Friday’s hackathon”",
    tags: ["Cross-department", "Alumni help"],
    cta: "Meet your people",
  },
  {
    id: "05",
    to: "/spotlight",
    tag: "SPOTLIGHT",
    dot: "bg-amber-400",
    tagColor: "text-amber-300 border-amber-400/30 bg-amber-400/10",
    glow: "251,191,36",
    title: "Be the first thing they see.",
    desc: "Selling a ticket? Need a teammate fast? Get to the top of every feed for a week with a Spotlight pass.",
    icon: "⭐",
    peek: "✨ Top of every feed · 7 days",
    tags: ["Top placement", "7 days"],
    cta: "Get noticed",
  },
];

function Header({ hint }) {
  return (
    <div className="relative z-10 mx-auto mb-8 w-full max-w-6xl shrink-0 px-6 [@media(max-height:800px)]:mb-5">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end [@media(max-height:800px)]:pb-4">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: EASE }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">The survival kit</p>
          <h2 className="font-serif text-4xl font-bold text-[#1a1a2e] md:text-6xl [@media(max-height:800px)]:md:text-5xl">
            Everything <span className="italic text-indigo-600">campus.</span>
          </h2>
        </motion.div>
        <p className="hidden font-mono text-sm tracking-wider text-gray-400 md:block">{hint}</p>
      </div>
    </div>
  );
}

/*
  One feature card. In the pinned version it also reacts to where it sits on screen:
  the card nearest the middle is full size and bright, the others sit back slightly, and the big
  number drifts a little against the scroll for depth. All of it runs on motion values, with no re-renders.
*/
function FeatureCard({ f, x, innerRef }) {
  const wrap = useRef(null);
  const centre = useRef(0);
  const zero = useMotionValue(0);
  const src = x || zero;
  const live = Boolean(x);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    innerRef?.(el);
    const measure = () => { centre.current = el.offsetLeft + el.offsetWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [innerRef]);

  // signed distance from the viewport centre, in viewport widths
  const dist = useTransform(src, (v) => (live ? (centre.current + v - window.innerWidth / 2) / window.innerWidth : 0));
  const focus = useTransform(dist, (d) => clamp01(1 - Math.abs(d) / 0.62));
  const scale = useTransform(focus, [0, 1], [0.96, 1]);
  const opacity = useTransform(focus, [0, 1], [0.82, 1]);
  const numX = useTransform(dist, [-1, 1], [-36, 36]);

  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div ref={wrap} style={live ? { scale, opacity } : undefined} className="shrink-0 snap-center w-[85vw] md:w-[420px]">
      <Link
        to={f.to}
        onPointerMove={onPointerMove}
        style={{ "--glow": f.glow }}
        className="group relative flex h-[490px] md:h-[470px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#14121f] p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 [@media(max-height:800px)]:h-[440px] [@media(max-height:800px)]:p-7"
      >
        {/* a soft light that follows the pointer, tinted to the card's colour */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(300px circle at var(--mx,50%) var(--my,0%), rgba(var(--glow),.16), transparent 65%)" }} />
        <motion.div aria-hidden style={live ? { x: numX } : undefined} className="pointer-events-none absolute right-6 top-4 select-none font-serif text-[120px] font-black leading-none text-white/[0.04] transition-transform duration-500 group-hover:scale-110">
          {f.id}
        </motion.div>

        <div className="relative mb-7 [@media(max-height:800px)]:mb-5">
          <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${f.tagColor}`}>{f.tag}</span>
        </div>
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-inner transition-transform duration-300 group-hover:rotate-6 [@media(max-height:800px)]:h-14 [@media(max-height:800px)]:w-14">{f.icon}</div>
        <h3 className="relative mb-3 font-serif text-2xl font-bold leading-snug text-white">{f.title}</h3>
        <p className="relative max-w-[94%] text-sm leading-relaxed text-gray-400">{f.desc}</p>

        <div className="relative mt-auto pt-5">
          <div className="mb-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[11.5px] leading-snug text-gray-300">{f.peek}</div>
          <div className="flex flex-wrap gap-2">
            {f.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-300">{t}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white">
            {f.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Static() {
  return (
    <section className="relative overflow-hidden bg-[#fafaf8] py-24">
      <Header hint="swipe →" />
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6">
        {FEATURES.map((f) => <FeatureCard key={f.id} f={f} />)}
      </div>
    </section>
  );
}

function Pinned() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cards = useRef([]);
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setShift(Math.max(0, trackRef.current.offsetWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const x = useTransform(progress, (p) => -p * shift);

  // which card is closest to the left edge of the viewport right now (drives the step dots)
  useMotionValueEvent(progress, "change", (p) => {
    const first = cards.current[0]?.offsetLeft ?? 0;
    const pos = p * shift;
    let best = 0;
    let bestD = Infinity;
    cards.current.forEach((el, i) => {
      const d = Math.abs((el?.offsetLeft ?? 0) - first - pos);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
  });

  const goTo = (i) => {
    const s = sectionRef.current;
    const first = cards.current[0]?.offsetLeft ?? 0;
    const want = shift ? clamp01(((cards.current[i]?.offsetLeft ?? 0) - first) / shift) : 0;
    const top = s.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + want * (s.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const bgTransform = useMotionTemplate`translate(calc(${springX}px - 50%), calc(${springY}px - 50%))`;

  const onMove = (e) => {
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  };

  const height = `calc(100vh + ${Math.round(shift * 1.5)}px)`;
  const setCard = (i) => (el) => { cards.current[i] = el; };

  return (
    <section ref={sectionRef} onMouseMove={onMove} style={{ height }} className="relative bg-[#fafaf8]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20 [@media(max-height:800px)]:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-[url('/topo.svg')] bg-cover bg-center" />
          <motion.div className="absolute h-[800px] w-[800px] rounded-full bg-indigo-500/10 blur-[100px]" style={{ transform: bgTransform }} />
        </div>

        <Header hint="keep scrolling, the track walks for you" />

        <motion.div ref={trackRef} style={{ x }} className="relative z-10 flex w-max gap-6 px-6 will-change-transform md:px-[max(1.5rem,calc((100vw-72rem)/2))]">
          {FEATURES.map((f, i) => <FeatureCard key={f.id} f={f} x={x} innerRef={setCard(i)} />)}
        </motion.div>

        {/* progress + step dots. Click a dot to jump to that card. */}
        <div className="relative z-10 mx-auto mt-7 w-full max-w-6xl px-6 [@media(max-height:800px)]:mt-5">
          <div className="h-[3px] overflow-hidden rounded-full bg-black/10">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-gradient-to-r from-indigo-500 to-orange-400" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono text-[11px] tracking-widest text-gray-500">
              <span className="font-bold text-[#1a1a2e]">0{active + 1}</span> / 0{FEATURES.length}
              <span className="ml-3 hidden uppercase text-gray-400 sm:inline">{FEATURES[active].tag}</span>
            </p>
            <div className="flex items-center gap-1">
              {FEATURES.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${f.tag.toLowerCase()}`}
                  aria-current={i === active}
                  className="group grid h-6 w-6 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span className={`block rounded-full transition-all duration-300 ${i === active ? `h-2 w-5 ${f.dot}` : "h-2 w-2 bg-gray-300 group-hover:bg-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesHorizontal() {
  const reduce = useReducedMotion();
  return reduce ? <Static /> : <Pinned />;
}