// client/src/pages/LandingPage.jsx
import { Navbar } from '../components/layout/Navbar';
import Hero from '../components/ui/Hero'; 

export default function LandingPage() {
  return (
    <div className="relative bg-[#fafaf8]">
      <Navbar />
      
      <Hero />

      {/* The Dark Section with the sweeping wave */}
      <div className="relative z-50 bg-[#09090b] text-white pt-32 overflow-hidden -mt-[10vh]">
        
        {/* The Exact Curve Design */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full">
          <svg 
            className="w-full h-[100px] md:h-[150px] block" 
            viewBox="0 0 1440 320" 
            preserveAspectRatio="none"
          >
            <path 
              fill="#09090b" 
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 pb-32">
          
          {/* Header */}
          <div className="text-center mb-24">
            <p className="text-indigo-400 text-xs tracking-[0.3em] uppercase font-bold mb-4">Let's be honest</p>
            <h2 className="text-4xl md:text-6xl font-sans font-bold">
              Campus life is <span className="relative inline-block text-red-500">broken.
                <svg className="absolute w-full h-2 -bottom-2 left-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Split Layout: Text on left, Mockup on right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-32">
            
            {/* Left Text */}
            <div>
              <h3 className="text-5xl md:text-7xl font-sans font-black leading-[1.1] tracking-tighter">
                "BRO TRUST<br/>ME."<br/>
                <span className="text-gray-400">"SEND<br/>ADVANCE."</span><br/>
                <span className="text-red-500">"LAST PRICE."</span>
              </h3>
              <p className="text-gray-400 mt-6 max-w-md">
                Buying and selling on campus shouldn't feel like a crime scene.
              </p>
            </div>

            {/* Right Mockup (Phone Screen) */}
            <div className="relative flex justify-center md:justify-end">
              <div className="w-[320px] bg-[#1c1a28] rounded-3xl border border-white/10 p-4 shadow-2xl relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">👤</div>
                  <div>
                    <div className="text-white font-bold text-sm">iPhone Seller (OLX)</div>
                    <div className="text-gray-400 text-xs">last seen today at 2:14 am</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="bg-[#2a2836] text-gray-300 text-sm p-3 rounded-2xl rounded-tl-sm self-start max-w-[85%]">
                    bhaiya, iPhone 13 still available?
                  </div>
                  <div className="bg-[#1e3a29] text-gray-200 text-sm p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%]">
                    Send ₹500 advance bro, I am out of station
                  </div>
                  <div className="bg-[#2a2836] text-gray-300 text-sm p-3 rounded-2xl rounded-tl-sm self-start max-w-[85%]">
                    sent. when can I pick it up?
                  </div>
                </div>

                <div className="mt-6 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold p-2 rounded-lg text-center flex items-center justify-center gap-2">
                  ⚠ This account no longer exists
                </div>
              </div>
              
              <div className="absolute -top-20 -right-10 text-[200px] font-black text-white/5 select-none pointer-events-none -z-10">
                01
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}