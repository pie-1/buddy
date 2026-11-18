import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal, MaskLine, EASE } from "./Reveal";
import { HangingNumber } from "./HangingNumber";

const LISTINGS = [
  { title: "Drafter · barely used", price: "Rs. 300", posted: "12 days ago", views: 3, note: "No buyers." },
  { title: "Casio FX-991 · 1 sem old", price: "Rs. 500", posted: "8 days ago", views: 7, note: "One DM. Ghosted." },
  { title: "Arduino · working", price: "Rs. 500", posted: "20 days ago", views: 2, note: "Forgot it was up." },
];

const ROOMMATE_PROBLEM = [
  { 
    type: "Seniors", 
    situation: "Has a room. Needs a flatmate.", 
    issue: "Can't verify a stranger from another college." 
  },
  { 
    type: "Beginners", 
    situation: "Looking for a room.", 
    issue: "Posts in a group. Gets 40 replies. No match." 
  }
];

const HELP_POST = {
  title: "Need DBMS past papers — anyone?",
  author: "Anonymous",
  posted: "14 hours ago",
  replies: 0,
  views: 11,
  body: "Exam is in 3 days. I've checked Drive, seniors, WhatsApp groups. Nothing. If anyone has last year's paper, please send.",
};

export function ProblemFlow() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <div ref={ref} data-nav-theme="dark" className="relative z-30 bg-[#09090b] text-white overflow-hidden pb-32">
      
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }} className="relative flex justify-center md:justify-start order-2 md:order-1">
            <Reveal y={50} className="relative w-[340px] bg-[#1c1a28] rounded-3xl border border-white/10 p-5 shadow-2xl z-10">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <span className="text-sm font-bold text-white">Your listings</span>
                <span className="text-xs text-gray-400">3 active</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {LISTINGS.map((l, i) => (
                  <motion.div
                    key={l.title}
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: EASE }}
                    className="bg-[#14121f] border border-white/10 rounded-xl p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[12px] font-bold text-gray-100 leading-tight">{l.title}</span>
                      <span className="text-[11px] font-bold text-emerald-400 shrink-0">{l.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{l.posted}</span>
                      <span>{l.views} views</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-red-400/70 italic">
                      {l.note}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </motion.div>

          <div className="order-1 md:order-2 relative">
            <HangingNumber num="02" color="text-[#a3e635]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>GOOD STUFF,</MaskLine>
              <MaskLine delay={0.1}>NO BUYERS.</MaskLine>
              <MaskLine delay={0.2} className="text-[#a3e635] mt-2">EVERY TIME.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.5} className="text-gray-400 mt-6 max-w-md relative z-10">
              You've got a drafter you barely used. A calculator you don't need.They sit on Facebook groups for weeks, buried under
              fifty new posts, waiting for a buyer who'll never scroll far enough to find them.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-8 pb-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <HangingNumber num="03" color="text-[#fbbf24]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>A ROOM.</MaskLine>
              <MaskLine delay={0.1}>A STRANGER.</MaskLine>
              <MaskLine delay={0.2} className="text-[#fbbf24] mt-2">NO WAY TO KNOW.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.4} className="text-gray-400 mt-6 max-w-md relative z-10">
              Posting "anyone looking for a flatmate near campus?" in a massive college group 
              just gets you buried. You have no idea if the person answering is a senior, 
              a beginner, or if they even go to your college. You're guessing with your safety.
            </Reveal>
          </div>

          <motion.div style={{ y: y2 }} className="relative flex justify-center md:justify-end">
            <Reveal y={50} className="relative w-[340px] bg-[#0f0e1a] rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col gap-3 z-10">
              <div className="flex items-center gap-2 pb-3 mb-1 border-b border-white/10">
                <span className="text-[11px] font-bold text-white">FB Group: "TU student groups"</span>
              </div>
              {ROOMMATE_PROBLEM.map((r, i) => (
                <motion.div
                  key={r.type}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.18, ease: EASE }}
                  className={`bg-[#1a1826] border border-amber-500/20 rounded-xl p-3`}
                >
                  <div className="flex items-start gap-2.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0`} />
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[12px] font-bold text-gray-200">{r.type}</div>
                      </div>
                      <div className="text-[11px] text-gray-400">{r.situation}</div>
                      <div className="text-[10px] text-amber-400/80 mt-1 italic">"{r.issue}"</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
                className="text-center text-[10px] tracking-[0.2em] uppercase text-red-400/70 italic pt-1"
              >
                — Result: endless back-and-forth. Or worse, a scam —
              </motion.div>
            </Reveal>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-8 pb-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y3 }} className="relative flex justify-center md:justify-start order-2 md:order-1">
            <Reveal y={50} className="relative w-[340px] bg-[#0f0e1a] rounded-3xl border border-white/10 p-5 shadow-2xl z-10">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
                <span className="text-[11px] font-bold text-white">Help board</span>
                <span className="text-[10px] text-gray-500 ml-auto">No replies</span>
              </div>
              <div className="mb-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-cyan-400 font-bold mb-1">
                  {HELP_POST.author} · {HELP_POST.posted}
                </div>
                <div className="text-[13px] font-bold text-white leading-tight mb-2">
                  {HELP_POST.title}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {HELP_POST.body}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] text-gray-500">
                <span>{HELP_POST.views} views</span>
                <span className="text-red-400/70 italic">{HELP_POST.replies} replies</span>
              </div>
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
                className="text-center text-[10px] tracking-[0.2em] uppercase text-red-400/60 italic pt-3"
              >
                — The exam is in 3 days —
              </motion.div>
            </Reveal>
          </motion.div>

          <div className="order-1 md:order-2 relative">
            <HangingNumber num="04" color="text-[#22d3ee]" />
            <h2 className="text-5xl md:text-7xl font-sans font-black leading-[1.05] tracking-tighter relative z-10">
              <MaskLine>YOU ASKED.</MaskLine>
              <MaskLine delay={0.1}>PEOPLE SAW</MaskLine>
              <MaskLine delay={0.2} className="text-[#22d3ee] mt-2">IT. NOBODY</MaskLine>
              <MaskLine delay={0.3} className="text-[#22d3ee]">ANSWERED.</MaskLine>
            </h2>
            <Reveal as="p" delay={0.5} className="text-gray-400 mt-6 max-w-md relative z-10">
              Past papers. A referral for a interview. The senior who actually
              cleared GSoC or other competitions. You've got questions that people on your own campus already
              know the answers to - they just never see your post.
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}