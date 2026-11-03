import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import Hero from '../components/ui/Hero'; 

const leftTexts = [
  { title: "Your Campus.", desc: "Verified .edu.np walls — only your college walks in." },
  { title: "Your Circle.", desc: "Find your people across departments and hostels." },
  { title: "Your CollegeBuddy.", desc: "The digital heartbeat of your university life." }
];

const rightTexts = [
  { title: "Connect", desc: "Chat with classmates, seniors, and find roommates." },
  { title: "Collaborate", desc: "Form project teams and share study resources." },
  { title: "Create", desc: "Host events, sell items, and build your campus rep." }
];

export default function LandingPage() {
  const [hoveredLeft, setHoveredLeft] = useState(null);
  const [hoveredRight, setHoveredRight] = useState(null);

  return (
    <div className="min-h-screen relative bg-[#fafaf8]">
      <Navbar />
      
      <div className="relative pt-20">
        <Hero />

        {/* Overlay Flanking Texts */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-12 md:px-24 max-w-[1500px] mx-auto w-full pt-10">
          
          <div className="hidden md:flex flex-col items-start gap-20 pointer-events-auto">
            {leftTexts.map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredLeft(i)}
                onMouseLeave={() => setHoveredLeft(null)}
              >
                <span className="relative z-10 text-[2.5rem] font-serif font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </span>
                <div className="absolute -bottom-4 left-0 w-16 h-[2px] bg-gray-300 group-hover:bg-indigo-300 transition-colors" />
                
                <AnimatePresence>
                  {hoveredLeft === i && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-6 w-64 text-sm font-sans font-medium text-gray-500 leading-relaxed"
                    >
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex flex-col items-end gap-20 pointer-events-auto">
            {rightTexts.map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className="relative cursor-pointer text-right group"
                onMouseEnter={() => setHoveredRight(i)}
                onMouseLeave={() => setHoveredRight(null)}
              >
                <span className="relative z-10 text-[2.5rem] font-serif font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </span>
                <div className="absolute -bottom-4 right-0 w-16 h-[2px] bg-gray-300 group-hover:bg-indigo-300 transition-colors" />

                <AnimatePresence>
                  {hoveredRight === i && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-6 right-0 w-64 text-sm font-sans font-medium text-gray-500 leading-relaxed"
                    >
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}