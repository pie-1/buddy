// client/src/components/layout/Navbar.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaStar, FaRegStar } from "react-icons/fa";
import { FiUser, FiUsers, FiChevronDown, FiStar } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const GITHUB_REPO = "https://github.com/pie-1/buddy";
const STORAGE_KEY = "cb:gh-starred";
const BASE_STARS = 47;

const FEATURE_LINKS = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Chat", to: "/chat" },
  { label: "Roommates", to: "/roommates" },
  { label: "Events", to: "/events" },
];

function GitHubWidget({ dark }) {
  const [starred, setStarred] = useState(false);
  const [stars, setStars] = useState(BASE_STARS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStarred(!!parsed.starred);
        setStars(BASE_STARS + (parsed.starred ? 1 : 0));
      }
    } catch {}
  }, []);

  const toggleStar = () => {
    window.open(GITHUB_REPO, "_blank", "noopener,noreferrer");
    const next = !starred;
    setStarred(next);
    setStars(BASE_STARS + (next ? 1 : 0));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ starred: next }));
    } catch {}
  };

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-full border text-sm font-semibold transition-colors ${
        dark ? "border-white/15 bg-white/[0.06] text-white" : "border-stone-200 bg-white text-stone-800"
      }`}
    >
      <a
        href={GITHUB_REPO}
        target="_blank"
        rel="noreferrer"
        aria-label="Open CollegeBuddy on GitHub"
        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-stone-100"}`}
      >
        <FaGithub size={15} />
      </a>
      <button
        onClick={toggleStar}
        aria-label={starred ? "Unstar" : "Star"}
        aria-pressed={starred}
        className={`flex items-center gap-1 px-2.5 py-1.5 border-l transition-colors ${
          dark ? "border-white/15 hover:bg-white/10" : "border-stone-200 hover:bg-stone-100"
        } ${starred ? (dark ? "text-yellow-300" : "text-amber-600") : ""}`}
      >
        {starred ? <FaStar size={13} /> : <FaRegStar size={13} />}
        <span className="tabular-nums text-xs">{stars}</span>
      </button>
    </div>
  );
}

function ProfileMenu({ dark, user, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkCls = dark ? "text-white/70 hover:text-white" : "text-stone-600 hover:text-stone-900";
  const itemCls = dark
    ? "text-white/80 hover:bg-white/5"
    : "text-stone-700 hover:bg-stone-50";
  const borderCls = dark ? "border-white/10" : "border-stone-100";

  return (
    <div ref={ref} className="relative z-[60]">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${linkCls}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Profile <FiChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl overflow-hidden z-[60] ${
              dark ? "bg-[#14121f] border-white/10" : "bg-white border-stone-200"
            }`}
            role="menu"
          >
            <Link
              to="/profile/me"
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${itemCls}`}
            >
              <FiUser size={14} /> My profile
            </Link>
            <Link
              to="/connect"
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-t transition-colors ${borderCls} ${itemCls}`}
            >
              <FiUsers size={14} /> Campus directory
            </Link>
            <Link
              to="/spotlight"
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-t transition-colors ${borderCls} ${itemCls}`}
            >
              <FiStar size={14} /> Spotlight
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const probe = 36;
      setDark(
        [...document.querySelectorAll('[data-nav-theme="dark"]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top - 60 <= probe && r.bottom >= probe;
        })
      );
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current)
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
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
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLogout = () => { logout(); setOpen(false); navigate("/"); };

  const link = `transition-colors ${dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`;
  const activeLink = dark ? "!text-white" : "!text-gray-900";

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <div ref={menuRef} className="relative w-full max-w-5xl pointer-events-auto">
        <nav
          className={`relative flex items-center justify-between gap-4 rounded-full px-4 sm:px-5 py-2.5 border backdrop-blur-md transition-all duration-500 ${
            dark ? "bg-white/[0.06] border-white/10 text-white" : "bg-white/70 border-black/5 text-gray-900"
          } ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)]" : ""}`}
        >
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-lg shrink-0">
            <span className={`grid place-items-center w-7 h-7 rounded-lg text-sm transition-colors duration-500 ${dark ? "bg-white text-[#1e1b4b]" : "bg-[#1e1b4b] text-white"}`}>C</span>
            CollegeBuddy
          </Link>

          <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
            {user && FEATURE_LINKS.map((l) => (
              <li key={l.label}><Link to={l.to} className={link}>{l.label}</Link></li>
            ))}
            {user && <li><ProfileMenu dark={dark} user={user} /></li>}
            <li>
              <NavLink to="/docs" className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`}>Docs</NavLink>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <GitHubWidget dark={dark} />
            {user ? (
              <button onClick={handleLogout} className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-gray-900 hover:bg-black/10"}`}>
                Log out
              </button>
            ) : (
              <>
                <Link to="/auth" className={`text-sm font-semibold ${link}`}>Log in</Link>
                <Link to="/auth?mode=signup" className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"}`}>
                  Get started
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className={`md:hidden relative w-9 h-9 rounded-full grid place-items-center transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
            <span className={`absolute h-[2px] w-4 rounded bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-[2px] w-4 rounded bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>

          {/* progress bar wrapped so its animation stays clipped */}
          <div className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden rounded-b-full">
            <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-violet-400 to-orange-400 opacity-80" style={{ transform: "scaleX(0)" }} />
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden absolute left-0 right-0 top-full mt-2 rounded-3xl border p-3 backdrop-blur-xl shadow-2xl ${dark ? "bg-[#14121f]/95 border-white/10 text-white" : "bg-white/95 border-black/5 text-gray-900"}`}
            >
              <div className="flex flex-col">
                {user && FEATURE_LINKS.map((l) => (
                  <Link key={l.label} to={l.to} className="px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5">{l.label}</Link>
                ))}
                {user && (
                  <>
                    <Link to="/profile/me" className="px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100">My profile</Link>
                    <Link to="/connect" className="px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100">Campus directory</Link>
                    <Link to="/spotlight" className="px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100">Spotlight</Link>
                  </>
                )}
                <Link to="/docs" className="px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100">Docs</Link>
                <div className={`my-2 h-px ${dark ? "bg-white/10" : "bg-black/5"}`} />
                <div className="px-1 py-1"><GitHubWidget dark={dark} /></div>
                <div className={`my-2 h-px ${dark ? "bg-white/10" : "bg-black/5"}`} />
                {user ? (
                  <button onClick={handleLogout} className="text-left px-4 py-3 rounded-2xl text-sm font-semibold opacity-80">Log out</button>
                ) : (
                  <div className="flex gap-2 p-1">
                    <Link to="/auth" className={`flex-1 text-center rounded-full py-2.5 text-sm font-semibold border ${dark ? "border-white/15" : "border-black/10"}`}>Log in</Link>
                    <Link to="/auth?mode=signup" className={`flex-1 text-center rounded-full py-2.5 text-sm font-semibold ${dark ? "bg-white text-black" : "bg-black text-white"}`}>Get started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}