// client/src/components/layout/Navbar.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const FEATURE_LINKS = ["Marketplace", "Borrow", "Roommates", "Events"];

export function Navbar() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const probe = 36;
      const isDark = [...document.querySelectorAll('[data-nav-theme="dark"]')].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top - 60 <= probe && r.bottom >= probe;
      });
      setDark(isDark);
    };
    const onScroll = () => !raf && (raf = requestAnimationFrame(check));
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-8 w-full max-w-5xl rounded-full px-5 py-2.5 border backdrop-blur-md transition-all duration-500 ${
          dark
            ? "bg-white/[0.06] border-white/10 text-white"
            : "bg-white/70 border-black/5 text-gray-900"
        } ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)]" : ""}`}
      >
        <Link to="/" className="flex items-center gap-2 font-serif font-bold text-lg">
          <span className={`grid place-items-center w-7 h-7 rounded-lg text-sm transition-colors duration-500 ${dark ? "bg-white text-[#1e1b4b]" : "bg-[#1e1b4b] text-white"}`}>C</span>
          CollegeBuddy
        </Link>

        <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
          {/* Only show feature links if user is logged in */}
          {user && FEATURE_LINKS.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className={`transition-colors ${dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
                {l}
              </a>
            </li>
          ))}
          <li>
            <Link to="/docs" className={`transition-colors ${dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
              Docs
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className={`text-sm font-semibold transition-colors ${dark ? "text-white" : "text-gray-900"}`}>
                Dashboard
              </Link>
              <button onClick={logout} className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-gray-900 hover:bg-black/10"}`}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className={`text-sm font-semibold transition-colors ${dark ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                Log in
              </Link>
              <Link
                to="/auth"
                className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"}`}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}