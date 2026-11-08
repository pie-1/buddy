// client/src/components/ui/AuthShowcase.jsx
// Rotating image panel for the login screen. Drop real photos in /public/images/auth/ (same names as
// `src` below). Until a photo exists, each slide falls back to an on-brand gradient poster, so it never looks broken.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDE_MS = 5000;
const EASE = [0.22, 1, 0.36, 1];

const SLIDES = [
  { src: "/images/auth/verify.jpeg", icon: "🎓", from: "#2a2670", to: "#0c0b18", caption: "Only real students. Verified.", sub: "Your university email is your key." },
  { src: "/images/auth/verify.jpeg", icon: "🛡️", from: "#c2570c", to: "#2b1005", caption: "No more “bro trust me”.", sub: "Escrow holds the money until you both tap done." },
  { src: "/images/auth/verify1.png", icon: "🏠", from: "#0e7490", to: "#051b26", caption: "A roommate who actually fits.", sub: "Match on habits, not just rent." },
  { src: "/images/auth/verify1.png", icon: "📡", from: "#b4235f", to: "#2d0a1a", caption: "Know what's happening on campus.", sub: "Hack nights, fests and open mics on one radar." },
];

// fallback art: contour rings + a glass tile with the slide's icon
function PosterArt({ slide }) {
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 20%, ${slide.from}, ${slide.to} 75%)` }}>
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-30" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {[60, 100, 140, 180, 220, 260].map((r, i) => (
          <ellipse key={r} cx="260" cy="190" rx={r * 1.15} ry={r} stroke="white" strokeWidth="0.8" transform={`rotate(${i * 9} 260 190)`} opacity={0.9 - i * 0.12} />
        ))}
      </svg>
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-[28px] bg-white/10 border border-white/20 backdrop-blur-md grid place-items-center text-6xl shadow-2xl">
        {slide.icon}
      </div>
    </div>
  );
}

export default function AuthShowcase() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState({}); // src -> true once an image 404s

  // warm the cache and learn early which photos are missing
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.onerror = () => setFailed((f) => ({ ...f, [s.src]: true }));
      img.src = s.src;
    });
  }, []);

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const slide = SLIDES[index];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0c0b18]">
      {/* crossfading layers, with a slow Ken Burns zoom on the active one */}
      {SLIDES.map((s, i) => (
        <div key={s.src} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: i === index && !reduce ? 1.08 : 1 }}
            transition={{ duration: i === index ? SLIDE_MS / 1000 + 1 : 1, ease: "linear" }}
          >
            {failed[s.src] ? (
              <PosterArt slide={s} />
            ) : (
              <>
                <PosterArt slide={s} />
                <img src={s.src} alt="" className="absolute inset-0 w-full h-full object-cover" onError={() => setFailed((f) => ({ ...f, [s.src]: true }))} />
              </>
            )}
          </motion.div>
        </div>
      ))}

      {/* legibility gradient + soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

      {/* story-style progress segments; each one drives the next slide when it completes */}
      <div className="absolute top-6 left-8 right-8 flex gap-2 z-10">
        {SLIDES.map((s, i) => (
          <button key={s.src} onClick={() => setIndex(i)} aria-label={`Show slide ${i + 1}`} className="relative h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden">
            {i < index && <span className="absolute inset-0 bg-white" />}
            {i === index && (
              <motion.span
                key={`p-${index}`}
                className="absolute inset-0 bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                onAnimationComplete={next}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute top-12 left-8 z-10 flex items-center gap-2 text-white/90 font-serif font-bold">
        <span className="grid place-items-center w-7 h-7 rounded-lg bg-white text-[#1e1b4b] text-sm">C</span> CollegeBuddy
      </div>

      {/* caption card */}
      <div className="absolute bottom-10 left-8 right-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-block max-w-md rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl px-6 py-4"
          >
            <p className="text-xl font-serif font-bold text-white leading-snug">{slide.caption}</p>
            <p className="text-sm text-white/70 mt-1">{slide.sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}