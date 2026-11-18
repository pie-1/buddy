import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function HangingNumber({ num, color }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px", once: true }); 

  return (
    <div ref={ref} className="absolute -top-40 left-0 md:-left-12 flex flex-col items-center pointer-events-none select-none z-0">
      <motion.div
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformOrigin: "top" }}
        className="w-[1.5px] h-48 bg-gradient-to-b from-transparent via-white/20 to-white/40"
      />
      
      <motion.div
        initial={reduce ? false : { y: -80, opacity: 0, rotate: -10 }}
        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 1.2, 
          delay: 0.2, 
          type: "spring", 
          stiffness: 50, 
          damping: 12,
          mass: 1
        }}
        style={{ transformOrigin: "top center" }}
      >
        <motion.div
          animate={
            inView && !reduce 
              ? { 
                  rotate: [-1.5, 1.5, -1.5],
                  filter: [
                    "drop-shadow(0px 0px 8px currentColor)", 
                    "drop-shadow(0px 0px 16px currentColor)", 
                    "drop-shadow(0px 0px 8px currentColor)"
                  ]
                } 
              : { rotate: 0, filter: "none" }
          }
          transition={
            inView && !reduce 
              ? { 
                  rotate: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 },
                  filter: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5 }
                } 
              : { duration: 0.4 }
          }
          style={{ transformOrigin: "top center" }}
          className={`text-[160px] md:text-[260px] font-serif font-black leading-none ${color} opacity-20 md:opacity-30`}
        >
          {num}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HangingNumber;