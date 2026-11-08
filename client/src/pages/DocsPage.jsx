// client/src/pages/DocsPage.jsx
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-40 px-6 pb-32">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-4">Open Source</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1a1a2e] mb-6">
            The CollegeBuddy <br/> Manifesto.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Building a verified campus network for Nepal, governed by the ACIT Research Chair. 
            Transparent, open, and built for students.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-12">
          
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">The Problem</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Campus life is fragmented. Students use unverified Facebook groups to buy, sell, and find roommates, leading to scams and mistrust. There is no central, verified space for students across different colleges to connect.
            </p>
            <h2 className="text-2xl font-serif font-bold mb-4 mt-8">The Solution</h2>
            <p className="text-gray-600 leading-relaxed">
              CollegeBuddy unifies the campus experience. By strictly verifying university emails (TU, PU, PoU), we create a trusted space for the Marketplace, Roommates, Events, and Project Teammates.
            </p>
          </div>

          <div className="bg-[#14121f] text-white p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-serif font-bold mb-4">Governance & PRs</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              This platform is maintained by the Research Chair Club. To contribute:
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 font-mono">01.</span>
                <span>Fork the repository from GitHub.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 font-mono">02.</span>
                <span>Create a feature branch (`feat/your-feature`).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 font-mono">03.</span>
                <span>Submit a Pull Request. Only ACIT Research Chair members can review and merge.</span>
              </li>
            </ul>
            <a href="#" className="inline-block mt-8 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
              View GitHub Repo
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}