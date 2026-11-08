// client/src/components/layout/Footer.jsx
import { motion, useReducedMotion } from "framer-motion";
import { MaskLine, Reveal, EASE } from "../features/Landing/Reveal";

const PAGES = ["Home", "Manifesto", "Features", "Blog", "Careers", "Waitlist"];
const FOLLOW = ["LinkedIn", "Twitter/X", "Instagram", "WhatsApp Channel", "YouTube"];
const LEGAL = ["Privacy Policy", "Terms", "Copyright"];

const WAVE = "M0,320L60,304C120,288,240,256,360,245.3C480,235,600,245,720,256C840,267,960,277,1080,266.7C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

function FootLink({ children, align = "left", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href="#"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`group relative w-fit text-sm text-gray-300 hover:text-white transition-colors ${align === "right" ? "md:ml-auto" : ""}`}
    >
      {children}
      <span className={`absolute -bottom-0.5 h-px w-full scale-x-0 bg-indigo-400 transition-transform duration-300 group-hover:scale-x-100 ${align === "right" ? "origin-right" : "origin-left"}`} />
    </motion.a>
  );
}

function Squiggle() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-12 overflow-visible text-indigo-400" fill="none" aria-hidden>
      <motion.path d="M4 44C12 20 22 18 28 34S42 50 54 30 70 14 86 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
      <motion.path d="M64 4v10M59 9h10" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" initial={reduce ? false : { opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.2, duration: 0.5, ease: EASE }} style={{ transformOrigin: "64px 9px" }} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer data-nav-theme="dark" className="relative z-20 bg-[#0a0914] text-white pt-36 md:pt-44 pb-10">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%] pointer-events-none">
        <svg className="w-full h-[100px] md:h-[180px] block" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path fill="#0a0914" d={WAVE} />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 28%, rgba(249,115,22,.07), transparent 70%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(79,70,229,.2), transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20 md:mb-24">
          <Squiggle />
          <h2 className="mt-8 text-5xl md:text-7xl font-sans font-black tracking-tighter leading-[1.02]">
            <MaskLine>YOUR CAMPUS.</MaskLine>
            <MaskLine delay={0.12} className="text-orange-500 drop-shadow-[0_0_24px_rgba(249,115,22,.4)]">UNLOCKED.</MaskLine>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-14 pb-16">
          <div className="flex flex-col gap-4">
            <Reveal as="h4" y={10} className="text-gray-500 font-bold mb-2 uppercase tracking-[0.3em] text-[10px]">Pages</Reveal>
            {PAGES.map((l, i) => <FootLink key={l} delay={0.05 * i}>{l}</FootLink>)}
          </div>

          <div className="flex flex-col items-center justify-center text-center order-first md:order-none">
            <Reveal as="h3" className="text-4xl font-serif font-bold text-indigo-400 mb-2">CollegeBuddy</Reveal>
            <Reveal as="p" delay={0.1} className="text-xs text-gray-500 mb-8">Your campus, unified.</Reveal>
            <Reveal delay={0.2}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="group relative overflow-hidden bg-[#4f46e5] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-[0_0_28px_rgba(79,70,229,.45)] flex items-center gap-2">
                <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 -translate-x-full transition-transform duration-700 group-hover:translate-x-[420%]" />
                <span className="relative">JOIN THE WAITLIST</span>
                <span className="relative transition-transform group-hover:translate-x-1">→</span>
              </motion.button>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <Reveal as="h4" y={10} className="text-gray-500 font-bold mb-2 uppercase tracking-[0.3em] text-[10px]">Follow on</Reveal>
            {FOLLOW.map((l, i) => <FootLink key={l} align="right" delay={0.05 * i}>{l}</FootLink>)}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          <p>© 2026 CollegeBuddy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {LEGAL.map((l) => <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>)}
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors" aria-label="Back to top">↑ Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
}