// client/src/components/features/Landing/FeaturesHorizontal.jsx
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";

const FEATURES = [
  {
    id: "01",
    to: "/marketplace",
    tag: "MARKETPLACE",
    tagColor: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10",
    title: "Don't buy new. Borrow smart.",
    desc: "Need a drafter for just one semester? Rent it from a senior. Sell last year's books. Your money stays safe until you both say “done”.",
    icon: "🛍️",
    tags: ["protected", "Verified students"],
    cta: "Browse the marketplace",
  },
  {
    id: "02",
    to: "/events",
    tag: "EVENTS",
    tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    title: "Never hear “it was yesterday”.",
    desc: "Hackathons, futsal, fests and open mics from every college, in one feed. Know first, show up first.",
    icon: "📡",
    tags: ["Hackathons", "Fests"],
    cta: "See what's on",
  },
  {
    id: "03",
    to: "/roommates",
    tag: "ROOMMATES",
    tagColor: "text-green-400 border-green-400/30 bg-green-400/10",
    title: "A flatmate who gets you.",
    desc: "Match on budget, area and habits (yes, the 2 AM kind). See rooms on a map instead of scrolling a group chat.",
    icon: "🏠",
    tags: ["Map view", "Habit match"],
    cta: "Find a room",
  },
  {
    id: "04",
    to: "/connect",
    tag: "CONNECT",
    tagColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    title: "Your team is one tap away.",
    desc: "Need a coder for your hackathon? A CS senior to ask “is this normal?” Reach people across departments and alumni.",
    icon: "🤝",
    tags: ["Cross-department", "Alumni help"],
    cta: "Meet your people",
  },
];

function Header({ hint }) {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 w-full mb-10 shrink-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
        <div>
          <p className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-3">The survival kit</p>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a2e]">
            Everything <span className="italic text-indigo-600">campus.</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm font-mono tracking-wider">{hint}</p>
      </div>
    </div>
  );
}

function FeatureCard({ f }) {
  return (
    <Link
      to={f.to}
      className="group relative shrink-0 snap-center w-[85vw] md:w-[420px] h-[460px] bg-[#14121f] rounded-3xl p-8 flex flex-col border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
    >
      <div className="absolute top-4 right-6 text-[120px] leading-none font-serif font-black text-white/[0.04] select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">{f.id}</div>
      <div className="mb-8">
        <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${f.tagColor}`}>{f.tag}</span>
      </div>
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-inner transition-transform duration-300 group-hover:rotate-6">{f.icon}</div>
      <h3 className="text-2xl font-serif font-bold text-white mb-3 leading-snug">{f.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed max-w-[92%]">{f.desc}</p>
      <div className="mt-auto pt-6 flex flex-wrap gap-2">
        {f.tags.map((t) => (
          <span key={t} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white">
        {f.cta}
        <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
      </div>
    </Link>
  );
}

function Static() {
  return (
    <section className="relative bg-[#fafaf8] py-24 overflow-hidden">
      <Header hint="swipe →" />
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-6">
        {FEATURES.map((f) => <FeatureCard key={f.id} f={f} />)}
      </div>
    </section>
  );
}

function Pinned() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [shift, setShift] = useState(0);

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

  return (
    <section ref={sectionRef} onMouseMove={onMove} style={{ height }} className="relative bg-[#fafaf8]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-[url('/topo.svg')] bg-cover bg-center" />
          <motion.div className="absolute w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[100px]" style={{ transform: bgTransform }} />
        </div>

        <Header hint="keep scrolling, the track walks for you" />

        <motion.div ref={trackRef} style={{ x }} className="relative z-10 flex gap-6 px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2))] w-max will-change-transform">
          {FEATURES.map((f) => <FeatureCard key={f.id} f={f} />)}
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full mt-8">
          <div className="h-[3px] rounded-full bg-black/10 overflow-hidden">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-gradient-to-r from-indigo-500 to-orange-400" />
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