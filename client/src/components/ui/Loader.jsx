import { motion } from 'framer-motion';
import { GlowBackground } from './GlowBackground';

export function Loader({ fullScreen = false }) {
  const letters = "CollegeBuddy".split("");

  const content = (
    <div className="flex flex-col items-center justify-center z-10">
      
      {/* Staggered Text Reveal */}
      <div className="flex gap-1 mb-8">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
            className="text-4xl font-serif font-bold text-white tracking-tight"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Glowing Progress Line */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-brand-orange to-transparent shadow-glow-orange"
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="mt-4 text-xs text-text-secondary tracking-widest uppercase"
      >
        Unlocking your campus
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg overflow-hidden">
        <GlowBackground />
        {content}
      </div>
    );
  }

  return <div className="py-12 w-full flex justify-center">{content}</div>;
}