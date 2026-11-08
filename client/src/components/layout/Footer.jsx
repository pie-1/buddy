// client/src/components/ui/Footer.jsx
export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#0a0914] text-white pt-40 pb-12 overflow-hidden">
      
      {/* The Exact Curved Transition from the screenshot */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%]">
        <svg className="w-full h-[120px] md:h-[180px] block" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="#0a0914" 
            d="M0,320L60,304C120,288,240,256,360,245.3C480,235,600,245,720,256C840,267,960,277,1080,266.7C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Top CTA */}
        <div className="text-center mb-24">
          <div className="flex justify-center mb-8">
            <span className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center text-lg font-bold shadow-[0_0_30px_rgba(79,70,229,0.5)]">C</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter mb-4">
            YOUR CAMPUS.<br/>
            <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">UNLOCKED.</span>
          </h2>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 pb-20">
          
          {/* Left Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Pages</h4>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Manifesto</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Waitlist</a>
          </div>

          {/* Center Brand & CTA */}
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-serif font-bold text-indigo-400 mb-2">CollegeBuddy</h3>
            <p className="text-xs text-gray-500 mb-8">Your campus, unified.</p>
            <button className="bg-[#4f46e5] hover:bg-indigo-500 text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2">
              JOIN THE WAITLIST <span>→</span>
            </button>
          </div>

          {/* Right Links */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <h4 className="text-gray-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Follow On</h4>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Twitter/X</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">WhatsApp Channel</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">YouTube</a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© 2026 CollegeBuddy. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Copyright</a>
          </div>
        </div>
      </div>
    </footer>
  );
}