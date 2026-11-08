// client/src/components/ui/FeaturesHorizontal.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

const FEATURES = [
  { id: "01", tag: "MARKETPLACE", tagColor: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10", title: "Campus Buy & Sell", desc: "Buy, sell and swap with verified students. Fast deals. Zero hassle.", icon: "🛍️", tags: ["Escrow", "In-app chat"] },
  { id: "02", tag: "SHARING", tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/10", title: "Borrow & Lend", desc: "Need it for today? Borrow it. Got it? Lend it. Earn easy.", icon: "📦", tags: ["Deadlines", "Trust score"] },
  { id: "03", tag: "SOCIAL", tagColor: "text-green-400 border-green-400/30 bg-green-400/10", title: "Roommates", desc: "Find verified flatmates based on budget, area, and habits.", icon: "🏠", tags: ["Map View", "Filters"] },
  { id: "04", tag: "EVENTS", tagColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10", title: "Campus Radar", desc: "Every fest, match and workshop. Never ask “what’s happening?”", icon: "📡", tags: ["RSVP", "Reminders"] }
];

export default function FeaturesHorizontal() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-72%"]);

  // Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const bgTransform = useMotionTemplate`translate(calc(${springX}px - 50%), calc(${springY}px - 50%))`;

  const handleMouseMove = (e) => {
    const rect = targetRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section ref={targetRef} onMouseMove={handleMouseMove} className="relative h-[300vh] bg-[#fafaf8]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20">
        
        {/* Interactive Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-[url('/topo.svg')] bg-cover bg-center" />
          <motion.div className="absolute w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[100px]" style={{ transform: bgTransform }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full mb-12 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
            <div>
              <p className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-3">The Arsenal</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a2e]">Student Life, <span className="text-indigo-600">Unified.</span></h2>
            </div>
            <p className="text-gray-400 text-sm font-mono tracking-wider">scroll — the track does the walking</p>
          </div>
        </div>

        <motion.div style={{ x }} className="relative z-10 flex gap-6 px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2))] w-max">
          {FEATURES.map((feat) => (
            <div key={feat.id} className="relative w-[85vw] md:w-[420px] h-[460px] bg-[#14121f] rounded-3xl p-8 flex flex-col border border-white/10 shadow-2xl group transition-transform hover:-translate-y-2 duration-300">
              <div className="absolute top-4 right-6 text-[120px] leading-none font-serif font-black text-white/[0.03] select-none pointer-events-none">{feat.id}</div>
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${feat.tagColor}`}>{feat.tag}</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-inner">{feat.icon}</div>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[90%]">{feat.desc}</p>
              <div className="mt-auto pt-6 flex flex-wrap gap-2">
                {feat.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}