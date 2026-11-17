// client/src/components/features/Landing/ProblemFlow.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal, MaskLine, EASE } from "./Reveal";
import { HangingNumber } from "./HangingNumber";

const CHAT_LIST = [
  { text: "Anyone know about the hackathon today?", sub: "Zero replies." },
  { text: "Need a drafter for 1 sem.", sub: "Seen by 4." },
  { text: "DSA past papers chahiyo yaar", sub: "Sent a blurry photo instead." },
  { text: "Hackathon team needs 1 coder!", sub: "Posted 3 days ago." },
];

const DM_EXCHANGE = [
  { from: "me", text: "Hey senior, quick question about internships…" },
  { from: "me", text: "You free to chat for 10 min?" },
  { from: "system", text: "Draft saved. Never sent." },
];

export function ProblemFlow() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 60]);

  return (
    <div ref={ref} data-nav-theme="dark" className="relative z-30 bg-[#09090b] text-white overflow-hidden pb-32">
      {/* SECTION 2: The Chat Graveyard */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }} className="relative flex justify-center md:justify-start order-2 md:order-1">
            <Reveal y={50} className="relative w-[340px] bg-[#1c1a28] rounded-3xl border border-white/10 p-5 shadow-2xl z-10">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <span className="text-sm font-bold text-white">Campus Groups</span>
                <span className="text-xs text-green-400">14 muted</span>
              </div>
              <div className="flex flex-col gap-4">
                {CHAT_LIST.map((chat, i) => (
                  <motion.div
                    key={chat.text}
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 grid place-items-center text-xs">👤</div>
                      <div>
                        <div className="text-xs font-bold text-gray-200">{chat.text}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{chat.sub}</div>
                      </div>
                    </div>
                    <span className="bg-white/10 text-[9px] px-1.5 py-0.5 rounded text-gray-400">999+</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </motion.div>

          <div className="order-1 md:order-2 relative">
            <HangingNumber num="02" color="text-[#a3e635]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>ALL THE CHATS.</MaskLine>
              <MaskLine delay={0.1}>NONE OF THE</MaskLine>
              <MaskLine delay={0.2}>ANSWERS.</MaskLine>
              <MaskLine delay={0.3} className="text-[#a3e635] mt-2">CLASSIC.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.5} className="text-gray-400 mt-6 max-w-md relative z-10">
              Teammate for the hackathon. Senior for advice. Past paper for tomorrow.
              Somewhere in fourteen muted groups, none of that exists.
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Silence */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <HangingNumber num="03" color="text-[#22d3ee]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>WHO'S UP?</MaskLine>
              <MaskLine delay={0.1}>...</MaskLine>
              <MaskLine delay={0.2} className="text-[#22d3ee] mt-2">NO ONE.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.4} className="text-gray-400 mt-6 max-w-md relative z-10">
              Drafting a DM to a senior you've never spoken to. Asking a stranger on Facebook to rent their drafter.
              The message stays in drafts — or the silence tells you everything.
            </Reveal>
          </div>

          <motion.div style={{ y: y2 }} className="relative flex justify-center md:justify-end">
            <Reveal y={50} className="relative w-[320px] bg-[#0f0e1a] rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col gap-3 z-10">
              <div className="flex items-center gap-3 mb-2 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-gray-700 grid place-items-center text-xs">👤</div>
                <div>
                  <div className="text-white text-xs font-bold">To: @senior_cs</div>
                  <div className="text-[10px] text-gray-500">Not in contacts</div>
                </div>
              </div>

              {DM_EXCHANGE.map((m, i) => {
                if (m.from === "system") {
                  return (
                    <motion.div
                      key={i}
                      initial={reduce ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
                      className="text-center text-[10px] tracking-[0.2em] uppercase text-red-400/70 italic py-3"
                    >
                      — {m.text} —
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.3, ease: EASE }}
                    style={{ transformOrigin: "0% 100%" }}
                    className="bg-[#6366f1] text-white text-[11px] p-3 rounded-2xl rounded-tl-sm self-start max-w-[85%]"
                  >
                    {m.text}
                  </motion.div>
                );
              })}
            </Reveal>
          </motion.div>
        </div>
      </section>
    </div>
  );
}