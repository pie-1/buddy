import { motion } from 'framer-motion';

export function GlowBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-bg">
      {/* Violet Orb */}
      <motion.div 
        animate={{ 
          x: [0, 50, -20, 0], 
          y: [0, -30, 40, 0],
          scale: [1, 1.05, 0.95, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-brand-violet/20 blur-[120px]" 
      />
      {/* Orange Orb */}
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0], 
          y: [0, 50, -20, 0],
          scale: [1, 0.9, 1.1, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/10 blur-[100px]" 
      />
    </div>
  );
}