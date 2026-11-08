// client/src/components/ui/ProblemFlow.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal, MaskLine } from "./Reveal";
import { HangingNumber } from "./HangingNumber";

const CHAT_LIST = [
  "CSE Official 2024-28", "CSE UNOFFICIAL ☠️", "Fest 2026 OFFICIAL",
  "Fest 2026 (REAL one)", "Notes Xchange [NO SPAM]", "hostel H4 mess updates"
];

export function ProblemFlow() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 60]);

  return (
    <div ref={ref} className="relative z-30 bg-[#09090b] text-white overflow-hidden pb-32">
      
      {/* SECTION 2 */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-48 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }} className="relative flex justify-center md:justify-start order-2 md:order-1">
             <Reveal y={50} className="relative w-[300px] bg-[#1c1a28] rounded-3xl border border-white/10 p-5 shadow-2xl z-10">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <span className="text-sm font-bold text-white">Chats</span>
                  <span className="text-xs text-green-400">74 muted</span>
                </div>
                <div className="flex flex-col gap-4">
                  {CHAT_LIST.map((chat) => (
                    <div key={chat} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">👤</div>
                        <div>
                          <div className="text-xs font-bold text-gray-200">{chat}</div>
                          <div className="text-[10px] text-gray-500">~ random forward, again</div>
                        </div>
                      </div>
                      <span className="bg-white/10 text-[9px] px-1.5 py-0.5 rounded text-gray-400">999+</span>
                    </div>
                  ))}
                </div>
             </Reveal>
          </motion.div>

          <div className="order-1 md:order-2 relative">
            <HangingNumber num="02" color="text-[#a3e635]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>ALL THE CHATS.</MaskLine>
              <MaskLine delay={0.1}>NONE OF THE</MaskLine>
              <MaskLine delay={0.2}>PLANS.</MaskLine>
              <MaskLine delay={0.3} className="text-[#a3e635] mt-2">CLASSIC.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.5} className="text-gray-400 mt-6 max-w-md relative z-10">
              74 muted groups — and the real plans still happen without you.
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-48 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <HangingNumber num="03" color="text-[#22d3ee]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>WHO'S UP?</MaskLine>
              <MaskLine delay={0.1}>...</MaskLine>
              <MaskLine delay={0.2} className="text-[#22d3ee] mt-2">EXACTLY.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.4} className="text-gray-400 mt-6 max-w-md relative z-10">
              You can't ask a stranger for help. So nobody ever asks.
            </Reveal>
          </div>

          <motion.div style={{ y: y2 }} className="relative flex justify-center md:justify-end">
             <Reveal y={50} className="relative w-[300px] bg-[#0f0e1a] rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col items-center justify-center min-h-[200px] z-10">
                <div className="bg-[#6366f1] text-white text-[11px] p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] mb-6">
                  anyone up for library tonight? exam in 2 days 🌙
                </div>
                <div className="text-center text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gray-800 grid place-items-center mx-auto mb-2 text-xs">👤</div>
                  <div className="text-[9px] tracking-[0.2em] uppercase">No one replied</div>
                </div>
             </Reveal>
          </motion.div>
        </div>
      </section>
    </div>
  );
}