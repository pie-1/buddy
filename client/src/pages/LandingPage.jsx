// client/src/pages/LandingPage.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import Hero from "../components/ui/Hero";
import { ProblemFlow } from "../components/ui/ProblemFlow";
import { TrustFlow } from "../components/ui/TrustFlow";
import FeaturesHorizontal from "../components/ui/FeaturesHorizontal";
import SocialsSection from "../components/ui/SocialsSection";
import Footer from "../components/ui/Footer";
import { Reveal, MaskLine, EASE } from "../components/ui/Reveal";
import { HangingNumber } from "../components/ui/HangingNumber";

const WAVE = "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

const CHAT = [
  { me: false, text: "bhaiya, iPhone 13 still available?" },
  { me: true, text: "Send ₹500 advance bro, I am out of station" },
  { me: false, text: "sent. when can I pick it up?" },
];

export default function LandingPage() {
  const reduce = useReducedMotion();
  const darkRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: darkRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <div className="relative bg-[#fafaf8]">
      <Navbar />
      <Hero />

      {/* Section 1: Campus life is broken */}
      <section ref={darkRef} data-nav-theme="dark" className="relative z-20 bg-[#09090b] text-white pt-32">
        
        {/* Top Wave - Pulls up over the Hero to hide the gap */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%] pointer-events-none">
          <svg className="w-full h-[100px] md:h-[150px] block" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#09090b" d={WAVE} />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 pb-32">
          <div className="text-center mb-24">
            <Reveal as="p" className="text-indigo-400 text-xs tracking-[0.3em] uppercase font-bold mb-4">Let's be honest</Reveal>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              <MaskLine>Campus life is</MaskLine>
              <MaskLine delay={0.12}>
                <span className="relative inline-block text-red-500">
                  broken.
                  <svg className="absolute w-full h-3 -bottom-2 left-0 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <motion.path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.9, ease: EASE }} />
                  </svg>
                </span>
              </MaskLine>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-32 relative">
            <div className="relative z-10">
              <HangingNumber num="01" color="text-white" />
              <h3 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] tracking-tight relative z-10">
                <MaskLine>“Bro trust</MaskLine>
                <MaskLine delay={0.08}>me.”</MaskLine>
                <MaskLine delay={0.3} className="text-gray-500 mt-3">“Send</MaskLine>
                <MaskLine delay={0.38} className="text-gray-500">advance.”</MaskLine>
                <MaskLine delay={0.6} className="text-red-500 italic mt-3">“Last price.”</MaskLine>
              </h3>
              <Reveal as="p" delay={0.8} className="text-gray-400 mt-8 max-w-md relative z-10">
                Buying and selling on campus shouldn't feel like a crime scene.
              </Reveal>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <motion.div style={{ y: y1 }} className="relative w-[320px] bg-[#1c1a28] rounded-3xl border border-white/10 p-4 shadow-2xl z-10">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-700 rounded-full grid place-items-center">👤</div>
                  <div>
                    <div className="text-white font-bold text-sm">iPhone Seller (OLX)</div>
                    <div className="text-gray-400 text-xs">last seen today at 2:14 am</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {CHAT.map((m, i) => (
                    <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 + i * 0.7, ease: EASE }} style={{ transformOrigin: m.me ? "100% 100%" : "0% 100%" }} className={`text-sm p-3 rounded-2xl max-w-[85%] ${m.me ? "bg-[#1e3a29] text-gray-200 rounded-tr-sm self-end" : "bg-[#2a2836] text-gray-300 rounded-tl-sm self-start"}`}>
                      {m.text}
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 + CHAT.length * 0.7 + 0.3, ease: EASE }} className="mt-6 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold p-2 rounded-lg text-center">
                  ⚠ This account no longer exists
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ProblemFlow />
      <TrustFlow />
      <FeaturesHorizontal />
      <SocialsSection />
      <Footer />
    </div>
  );
}