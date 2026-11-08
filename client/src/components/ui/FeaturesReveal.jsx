// client/src/components/ui/FeaturesReveal.jsx
import { motion } from "framer-motion";
import { Reveal, MaskLine } from "./Reveal";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const card = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function FeaturesReveal() {
  return (
    <section className="relative z-20 bg-[#fafaf8] px-6 py-32">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-20">
          <Reveal as="p" className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-4">The Solution</Reveal>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a2e] leading-tight">
            <MaskLine>One verified app.</MaskLine>
            <MaskLine delay={0.12}><span className="italic text-indigo-600">Everything campus.</span></MaskLine>
          </h2>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Marketplace */}
          <motion.div variants={card} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-9xl font-black">🛍️</div>
            <h3 className="text-2xl font-serif font-bold mb-3">Buy, sell & rent safely.</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm">
              Verified students only. Escrow protects your money until you meet on campus and confirm the handover.
            </p>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">Marketplace</span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">Borrow/Rent</span>
            </div>
          </motion.div>

          {/* Roommates */}
          <motion.div variants={card} className="bg-[#1e1b4b] text-white rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>
             <h3 className="text-2xl font-serif font-bold mb-3">Find flatmates.</h3>
             <p className="text-indigo-200 text-sm mb-8">Match based on budget, area, and habits. No more sketchy Facebook groups.</p>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
               <div className="w-[94%] h-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
             </div>
             <div className="text-xs text-indigo-300">94% Match Found</div>
          </motion.div>

          {/* Events */}
          <motion.div variants={card} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="text-3xl mb-4">📡</div>
            <h3 className="text-xl font-serif font-bold mb-2">Campus Radar.</h3>
            <p className="text-gray-500 text-sm">Never miss a hackathon, futsal match, or fest again.</p>
          </motion.div>

          {/* Teams */}
          <motion.div variants={card} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] md:col-span-2 flex flex-col justify-center">
             <div className="text-3xl mb-4">🤝</div>
             <h3 className="text-xl font-serif font-bold mb-2">Form project teams.</h3>
             <p className="text-gray-500 text-sm">Post your project, list the roles you need, and find collaborators from other departments instantly.</p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}