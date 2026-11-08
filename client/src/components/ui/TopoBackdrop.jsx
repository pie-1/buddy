// client/src/components/ui/TopoBackdrop.jsx
// The hero's contour map as a quiet, reusable background: no asset file, redrawn slowly (~8 fps),
// paused when offscreen, frozen for reduced-motion. Needs topoField.js next to it.
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { createTopoField } from "../features/Hero/topoField";

export function TopoBackdrop({ className = "", animate = true, flow = 0 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const field = createTopoField(canvas);
    const live = animate && !reduce;
    const seed = Math.random() * 200; // each instance gets its own terrain
    let raf;
    let visible = true;
    let lastDraw = 0;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    // createTopoField clears its grids on resize, so force a redraw afterwards
    const ro = new ResizeObserver(() => (lastDraw = 0));
    ro.observe(canvas);

    const tick = (ts) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (lastDraw && (!live || ts - lastDraw < 120)) return;
      const dt = lastDraw ? Math.min(0.2, (ts - lastDraw) / 1000) : 0.016;
      lastDraw = ts;
      field.draw({ t: ts / 1000 + seed, dt, x: 0, y: 0, speed: 0, on: 0, mx: 0, my: 0, flow });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      field.destroy();
    };
  }, [animate, reduce, flow]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, #000 45%, rgba(0,0,0,.35) 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, #000 45%, rgba(0,0,0,.35) 100%)",
      }}
    />
  );
}