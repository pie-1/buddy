// client/src/components/ui/Reveal.jsx
import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/** Fade + rise on enter. Respects reduced motion. */
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div", once = true }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** A line of text that slides up out of a mask, like a printed headline. */
export function MaskLine({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  // The trigger lives on the (unclipped) wrapper: an IntersectionObserver never fires for a
  // child that is translated fully out of its overflow-hidden parent.
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "108%" }, show: { y: "0%" } }}
        transition={{ duration: 0.95, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}