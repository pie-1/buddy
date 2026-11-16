// client/src/components/features/Landing/HangingNumber.jsx
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function HangingNumber({ num, color }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" }); // sway only while visible, saves battery on phones

  return (
    <div ref={ref} className="absolute -top-40 left-0 md:-left-12 flex flex-col items-center pointer-events-none select-none z-0">
      {/* The rope drops first, then the number swings in on it */}
      <motion.div
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: "top" }}
        className="w-[1.5px] h-48 bg-gradient-to-b from-transparent via-white/10 to-white/30"
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, rotate: -14 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.5, type: "spring", stiffness: 60, damping: 8 }}
        style={{ transformOrigin: "top center" }}
      >
        <motion.div
          animate={inView && !reduce ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
          transition={inView && !reduce ? { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.6 } : { duration: 0.4 }}
          style={{ transformOrigin: "top center" }}
          className={`text-[160px] md:text-[260px] font-serif font-black leading-none ${color} opacity-[0.15] drop-shadow-2xl`}
        >
          {num}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HangingNumber;