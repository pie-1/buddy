// client/src/components/ui/SocialsSection.jsx
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef } from "react";
import { MaskLine, Reveal } from "./Reveal";

const CARDS = [
  { color: "bg-[#1e1b4b]", icon: "📚", tag: "Library", rot: -20, x: -300, y: 80 },
  { color: "bg-[#7c2d12]", icon: "☕", tag: "Chai Point", rot: -14, x: -200, y: 40 },
  { color: "bg-[#0f766e]", icon: "💻", tag: "Hack Night", rot: -7, x: -100, y: 10 },
  { color: "bg-[#4c1d95]", icon: "🎡", tag: "Fest Night", rot: 0, x: 0, y: 0 },
  { color: "bg-[#3f6212]", icon: "🏀", tag: "Futsal", rot: 7, x: 100, y: 10 },
  { color: "bg-[#064e3b]", icon: "🎤", tag: "Open Mic", rot: 14, x: 200, y: 40 },
  { color: "bg-[#831843]", icon: "🎸", tag: "Battle", rot: 20, x: 300, y: 80 },
];

export default function SocialsSection() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const bgTransform = useMotionTemplate`translate(calc(${springX}px - 50%), calc(${springY}px - 50%))`;

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative z-20 bg-[#fafaf8] pt-32 pb-0 overflow-hidden">
      
      {/* Interactive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-[url('/topo.svg')] bg-cover bg-center" />
        <motion.div className="absolute w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[100px]" style={{ transform: bgTransform }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <Reveal as="p" className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-4">The Feed</Reveal>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a2e] leading-tight mb-20">
          <MaskLine>WHAT'S UP <span className="text-indigo-600">ON SOCIALS</span></MaskLine>
        </h2>

        {/* Arched Cards Container */}
        <div className="relative flex justify-center items-end h-[350px] mb-20">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 0, y: 150 }}
              whileInView={{ opacity: 1, x: card.x, y: card.y }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, type: "spring", bounce: 0.3 }}
              style={{ rotate: card.rot, zIndex: 10 - Math.abs(i - 3) }}
              className={`absolute bottom-0 w-[160px] h-[240px] rounded-2xl ${card.color} border border-white/10 shadow-2xl flex flex-col p-4 transform origin-bottom`}
            >
              <div className="self-end text-[9px] text-white/60 bg-black/20 px-2 py-1 rounded-full mb-4">
                ▲ {Math.floor(Math.random() * 5) + 4}.{Math.floor(Math.random() * 9)}k
              </div>
              <div className="text-4xl mb-auto self-center mt-6">{card.icon}</div>
              <div className="text-white font-bold text-sm text-left">{card.tag}</div>
            </motion.div>
          ))}
        </div>

        <div className="pb-32">
          <p className="text-gray-400 text-sm mb-6">Follow the chaos</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["LINKEDIN", "TWITTER / X", "INSTAGRAM", "WHATSAPP CHANNEL", "YOUTUBE"].map((social) => (
              <a key={social} href="#" className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold tracking-wider text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}