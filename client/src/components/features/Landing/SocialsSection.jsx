// client/src/components/features/Landing/SocialsSection.jsx
// "A normal Tuesday on CollegeBuddy": a fan of mini app cards (listing, room, loan, event, team request),
// not generic posters. Desktop = hoverable fan. Phone = swipeable row. Every card links to its real page.
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import { MaskLine, Reveal, EASE } from "./Reveal";
import { TopoBackdrop } from "../../ui/TopoBackdrop";

const WAVE = "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

// Order = left to right. The middle card (index 2) is the star of the fan.
const CARDS = [
  { id: "market", to: "/marketplace", from: "#2a2670", to2: "#12103a", icon: "🛍️", tag: "Marketplace", title: "Casio fx-991 calculator", sub: "Rs. 900 · 3rd sem student", foot: { kind: "chip", text: "✓ Verified seller · Escrow on" }, rot: -12, x: -350, y: 56 },
  { id: "rooms", to: "/roommates", from: "#0e7490", to2: "#0b3b4d", icon: "🏠", tag: "Roommates", title: "Room near the campus gate", sub: "Rs. 6,500 / month · 2 sharing", foot: { kind: "chip", text: "94% habit match" }, rot: -6, x: -175, y: 18 },
  { id: "lend", to: "/marketplace", from: "#6d3fe0", to2: "#25124f", icon: "📚", tag: "Borrow & lend", title: "Engg Maths, lent to Rohan", sub: "Reminder goes out tomorrow", foot: { kind: "bar", value: 0.72, text: "Due in 2 days" }, rot: 0, x: 0, y: 0 },
  { id: "events", to: "/events", from: "#c2570c", to2: "#5a230a", icon: "📡", tag: "Campus Radar", title: "ACIT Hack Night", sub: "Tonight · 7 PM · Seminar Hall", foot: { kind: "avatars", text: "+48 going" }, rot: 6, x: 175, y: 18 },
  { id: "team", to: "/events", from: "#b4235f", to2: "#4a0e2a", icon: "🤝", tag: "Teams", title: "Need a designer for our hackathon team", sub: "2 of 4 roles open", foot: { kind: "chip", text: "Reply in chat" }, rot: 12, x: 350, y: 56 },
];

// Only real links are shown. Fill the empty ones in and they appear automatically.
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/pie-1/buddy" },
  { label: "LinkedIn", href: "" },
  { label: "Instagram", href: "" },
  { label: "Twitter / X", href: "" },
  { label: "WhatsApp Channel", href: "" },
];

function Rings() {
  return (
    <svg viewBox="0 0 200 250" className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none" fill="none" stroke="white" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[50, 80, 110, 140].map((r, i) => (
        <ellipse key={r} cx="150" cy="60" rx={r * 1.15} ry={r} strokeWidth="0.8" transform={`rotate(${i * 9} 150 60)`} />
      ))}
    </svg>
  );
}

function Foot({ f }) {
  if (f.kind === "bar")
    return (
      <div>
        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden mb-1.5">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300" style={{ width: `${f.value * 100}%` }} />
        </div>
        <div className="text-[10px] text-white/75 font-semibold">{f.text}</div>
      </div>
    );
  if (f.kind === "avatars")
    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {["🧑‍💻", "👩‍🎓", "🧑‍🎨"].map((a, i) => (
            <span key={i} className="w-6 h-6 rounded-full bg-white/20 border border-white/30 grid place-items-center text-[11px]">{a}</span>
          ))}
        </div>
        <span className="ml-2 text-[10px] text-white/85 font-semibold">{f.text}</span>
      </div>
    );
  return <span className="inline-flex text-[10px] font-bold text-white/90 bg-white/15 border border-white/20 rounded-full px-2.5 py-1">{f.text}</span>;
}

function CardBody({ c }) {
  return (
    <Link to={c.to} className="absolute inset-0 p-4 flex flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/70">{c.tag}</span>
        <span className="text-2xl drop-shadow">{c.icon}</span>
      </div>
      <h3 className="mt-5 text-[17px] leading-snug font-serif font-bold text-white">{c.title}</h3>
      <p className="mt-1.5 text-[11px] text-white/60">{c.sub}</p>
      <div className="mt-auto"><Foot f={c.foot} /></div>
    </Link>
  );
}

export default function SocialsSection({ topColor = "#09090b" }) {
  const reduce = useReducedMotion();
  const { user } = useContext(AuthContext);
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

  const socials = SOCIALS.filter((s) => s.href);
  const mid = Math.floor(CARDS.length / 2);

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
          <motion.div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full will-change-transform" style={{ x: glowX, y: glowY, background: "radial-gradient(circle, rgba(99,102,241,.14), transparent 65%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Reveal as="p" className="text-indigo-600 text-[11px] tracking-[0.4em] uppercase font-bold mb-4">Live on campus</Reveal>
          <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tighter text-[#1a1a2e] leading-none mb-3">
            <MaskLine>A NORMAL TUESDAY</MaskLine>
            <MaskLine delay={0.1}><span className="text-indigo-600">ON COLLEGEBUDDY</span></MaskLine>
          </h2>
          <Reveal as="p" delay={0.2} className="text-gray-500 mb-14 md:mb-24 max-w-md mx-auto">
            Books lent, rooms found, hack nights filled. No group chat needed.
          </Reveal>

          {/* desktop: hoverable fan */}
          <div ref={fanRef} onMouseLeave={() => setHover(null)} className="hidden md:flex relative mx-auto justify-center items-end h-[340px] mb-14 origin-bottom">
            {CARDS.map((c, i) => {
              const isHover = hover === i;
              const shift = hover === null || isHover ? 0 : i < hover ? -30 : 30;
              const shown = reduce || inView;
              return (
                <motion.div
                  key={c.id}
                  onMouseEnter={() => setHover(i)}
                  initial={reduce ? false : { opacity: 0, x: 0, y: 160, rotate: 0 }}
                  animate={shown ? { opacity: 1, x: c.x + shift, y: isHover ? c.y - 38 : c.y, rotate: isHover ? c.rot * 0.3 : c.rot, scale: isHover ? 1.07 : 1 } : undefined}
                  transition={{ type: "spring", stiffness: 170, damping: 18, delay: entered || reduce ? 0 : i * 0.08 }}
                  style={{ zIndex: isHover ? 30 : 10 - Math.abs(i - mid), background: `linear-gradient(180deg, ${c.from}, ${c.to2})` }}
                  className="absolute bottom-0 w-[190px] h-[260px] rounded-2xl border border-white/10 overflow-hidden origin-bottom shadow-[0_24px_40px_-14px_rgba(15,10,40,.45)]"
                >
                  <Rings />
                  <CardBody c={c} />
                </motion.div>
              );
            })}
          </div>

          {/* phone: swipeable row */}
          <div className="md:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 mb-8">
            {CARDS.map((c) => (
              <div
                key={c.id}
                className="relative snap-center shrink-0 w-[230px] h-[270px] rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_36px_-14px_rgba(15,10,40,.45)]"
                style={{ background: `linear-gradient(180deg, ${c.from}, ${c.to2})` }}
              >
                <Rings />
                <CardBody c={c} />
              </div>
            ))}
          </div>

          <div className="pb-28 md:pb-36">
            <Reveal as="p" className="text-gray-400 text-xs mb-6">Sample posts, for illustration. The real feed is written by your classmates.</Reveal>
            <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
              <Link
                to={user ? "/dashboard" : "/auth?mode=signup"}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a2e] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(26,26,46,.6)] transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
              >
                {user ? "Open your dashboard" : "Join your campus"} <span aria-hidden>→</span>
              </Link>
              <Link to="/marketplace" className="inline-flex items-center rounded-full border border-gray-300 bg-white/70 px-6 py-3.5 text-sm font-semibold text-gray-700 backdrop-blur transition-colors hover:border-indigo-400 hover:text-indigo-600">
                Browse the marketplace
              </Link>
            </Reveal>

            {socials.length > 0 && (
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {socials.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm text-[10px] font-bold tracking-[0.18em] uppercase text-gray-600 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                  >
                    {s.label}
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}