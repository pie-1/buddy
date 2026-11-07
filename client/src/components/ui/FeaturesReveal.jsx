// client/src/components/ui/FeaturesReveal.jsx
import { motion } from "framer-motion";

export function FeaturesReveal() {
  return (
    <div className="relative z-50 bg-[#fafaf8] pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Student Life, Unified.</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Everything you need to survive and thrive on campus, in one verified space.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#14121f] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl font-black">01</div>
            <div className="text-4xl mb-6">🛍️</div>
            <h3 className="text-2xl font-bold mb-2">Campus Buy & Sell</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Buy, sell and swap with verified students. Fast deals. Zero hassle.</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">Escrow</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">In-app chat</span>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 text-gray-900 relative overflow-hidden shadow-xl border border-gray-100"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 text-9xl font-black">02</div>
            <div className="text-4xl mb-6">📚</div>
            <h3 className="text-2xl font-bold mb-2">Borrow & Lend</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Need a lab coat or a calculator? Rent it from a senior for the semester.</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">Deadlines</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">Trust Score</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}