// client/src/components/ui/Hero.jsx
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { createTopoField } from "./topoField";
import { blobOutline, outlinePath } from "./blob";
import { HeroCard } from "./HeroCard";

const R = 150;

export default function Hero() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const passRef = useRef(null);
  const canvasRef = useRef(null);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const glowSvgRef = useRef(null);
  const auraRef = useRef(null);

  // Use 300vh so the scroll animation takes longer and is more visible
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Shrink card to 40% and keep it fully visible
  const cardScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.4]);
  const cardY = useTransform(scrollYProgress, [0, 0.4], [0, 0]); 
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 1]);

  // Fade out side text immediately
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  
  // Giant text fades in and slides up
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

  useEffect(() => {
    const hero = heroRef.current;
    const card = cardRef.current;
    const pass = passRef.current;
    const fill = fillRef.current;
    const glow = glowRef.current;
    const glowSvg = glowSvgRef.current;
    const auraPath = auraRef.current;
    const field = createTopoField(canvasRef.current);
    
    const m = { x: innerWidth / 2, y: innerHeight / 2 }; 
    const lens = { ...m }; 
    const aura = { ...m }; 
    const vel = { x: 0, y: 0 }; 
    const dir = { x: 1, y: 0 }; 
    const par = { x: 0, y: 0 }; 
    let on = 0; 
    let onV = 0;
    let want = 0;
    let last = performance.now();
    let raf;

    const onMove = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      if (!want) {
        lens.x = aura.x = m.x; 
        lens.y = aura.y = m.y;
      }
      want = 1;
    };
    const onLeave = () => (want = 0);

    const tick = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      const t = ts / 1000;

      const px = lens.x;
      const py = lens.y;
      lens.x += (m.x - lens.x) * 0.2;
      lens.y += (m.y - lens.y) * 0.2;
      aura.x += (m.x - aura.x) * 0.09;
      aura.y += (m.y - aura.y) * 0.09;
      par.x += (m.x / innerWidth - 0.5 - par.x) * 0.05;
      par.y += (m.y / innerHeight - 0.5 - par.y) * 0.05;

      vel.x += (lens.x - px - vel.x) * 0.2;
      vel.y += (lens.y - py - vel.y) * 0.2;
      const speed = Math.hypot(vel.x, vel.y);
      if (speed > 0.05) {
        dir.x = vel.x / speed;
        dir.y = vel.y / speed;
      }
      const stretch = Math.min(0.3, speed * 0.018); 

      onV = (onV + (want - on) * 0.16) * 0.78;
      on = Math.max(0, on + onV);

      const h = hero.getBoundingClientRect();
      const c = card.getBoundingClientRect();

      if (on > 0.01 && c.top < innerHeight) {
        const r = R * on;
        const body = blobOutline(r, t, dir.x, dir.y, stretch, 0);
        const trail = blobOutline(r * 1.45, t, dir.x, dir.y, stretch * 1.4, 1.7);
        const o = Math.min(1, on);
        
        fill.setAttribute("d", outlinePath(body, lens.x - h.left, lens.y - h.top)); 
        pass.style.clipPath = `path("${outlinePath(body, lens.x - c.left, lens.y - c.top)}")`; 
        glow.setAttribute("d", outlinePath(body, lens.x - h.left, lens.y - h.top)); 
        glowSvg.style.opacity = o;
        auraPath.setAttribute("d", outlinePath(trail, aura.x - h.left, aura.y - h.top)); 
        auraPath.style.opacity = o;
      } else {
        fill.setAttribute("d", "");
        auraPath.setAttribute("d", "");
        pass.style.clipPath = "circle(0px at 0 0)";
        glowSvg.style.opacity = 0;
      }

      field.draw({ t: t, dt, x: lens.x - h.left, y: lens.y - h.top, speed, on, mx: par.x, my: par.y });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      field.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-[#fafaf8]">
      <div ref={heroRef} className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        <div className="absolute inset-0 z-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, rgba(0,0,0,.5) 100%)" }} />
        </div>

        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <radialGradient id="cb-lens-fill"><stop offset="0" stopColor="#f6f2ff" /><stop offset="0.65" stopColor="#ebe3ff" /><stop offset="1" stopColor="#d9ccff" /></radialGradient>
            <radialGradient id="cb-aura-fill"><stop offset="0" stopColor="rgb(139,92,246)" stopOpacity=".28" /><stop offset="0.6" stopColor="rgb(139,92,246)" stopOpacity=".2" /><stop offset="1" stopColor="rgb(139,92,246)" stopOpacity="0" /></radialGradient>
          </defs>
          <path ref={auraRef} fill="url(#cb-aura-fill)" />
          <path ref={fillRef} fill="url(#cb-lens-fill)" stroke="rgba(124,92,255,.3)" strokeWidth="1.2" />
        </svg>

        <svg ref={glowSvgRef} className="absolute inset-0 w-full h-full z-30 pointer-events-none opacity-0">
          <defs><path ref={glowRef} id="cb-lens-edge" fill="none" /></defs>
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.07)" strokeWidth="46" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.11)" strokeWidth="28" strokeLinejoin="round" />
          <use href="#cb-lens-edge" stroke="rgba(139,92,246,.22)" strokeWidth="12" strokeLinejoin="round" />
        </svg>

        <HeroCard cardRef={cardRef} passRef={passRef} scale={cardScale} opacity={cardOpacity} y={cardY} />

        {/* Solid Dark Navy Text */}
        <motion.div 
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-[65%] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[130px] font-sans font-bold tracking-tighter text-[#1a1a2e] whitespace-nowrap">
            connect.buy.belong
          </h1>
        </motion.div>

        {/* Side Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-12 md:px-24 max-w-[1500px] mx-auto w-full"
        >
          <div className="hidden md:flex flex-col items-start gap-20 pointer-events-auto">
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Your Campus.</div>
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Your Circle.</div>
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Your CollegeBuddy.</div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-20 pointer-events-auto">
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Connect</div>
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Collaborate</div>
            <div className="text-[2.5rem] font-serif font-bold text-gray-900">Create</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}