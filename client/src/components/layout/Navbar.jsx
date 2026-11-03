import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3">
          {/* Logo SVG placeholder - Replace with your actual logo image */}
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white font-serif font-bold">
            C
          </div>
          <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            CollegeBuddy
          </span>
        </Link>

        {/* Navigation Links (Hidden on mobile for now) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/marketplace" className="hover:text-black transition-colors">Marketplace</Link>
          <Link to="/roommates" className="hover:text-black transition-colors">Roommates</Link>
          <Link to="/events" className="hover:text-black transition-colors">Events</Link>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black hidden sm:block">
            Log in
          </Link>
          <Link to="/signup">
            <Button variant="primary" className="bg-black text-white hover:bg-gray-800 hover:shadow-none rounded-full px-6">
              Enter CollegeBuddy
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}