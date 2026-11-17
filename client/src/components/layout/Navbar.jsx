import { useEffect, useRef, useState, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaStar } from "react-icons/fa";
import { FiUser, FiUsers, FiChevronDown, FiStar, FiShield, FiMessageSquare, FiHelpCircle } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const GITHUB_REPO = "https://github.com/pie-1/buddy";
const GITHUB_API = "https://api.github.com/repos/pie-1/buddy";
const STARS_BASE_KEY = "cb:gh-star-base";
const STARS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

const PUBLIC_LINKS = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Roommates", to: "/roommates" },
  { label: "Events", to: "/events" },
];

const MEMBER_LINKS = [
  { label: "Chat", to: "/chat", icon: <FiMessageSquare /> },
  { label: "Help", to: "/help", icon: <FiHelpCircle /> },
];

const DOCS_LINK = { label: "Docs", to: "/docs" };

function GitHubWidget({ dark }) {
  const [count, setCount] = useState(null);
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(STARS_BASE_KEY) || "null");
      if (cached && typeof cached.n === "number" && Date.now() - cached.t < STARS_CACHE_TTL) {
        setCount(cached.n);
        return;
      }
    } catch {}

    let cancelled = false;
    fetch(GITHUB_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d || typeof d.stargazers_count !== "number") return;
        setCount(d.stargazers_count);
        try {
          localStorage.setItem(
            STARS_BASE_KEY,
            JSON.stringify({ n: d.stargazers_count, t: Date.now() })
          );
        } catch {}
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleClick = () => {
    if (!bumped) {
      setCount((c) => (c ?? 0) + 1);
      setBumped(true);
    }
    setTimeout(() => {
      window.open(GITHUB_REPO, "_blank", "noopener,noreferrer");
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Star CollegeBuddy on GitHub"
      title="Star us on GitHub ⭐"
      className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
        dark
          ? "border-white/15 bg-white/[0.06] text-white hover:bg-white/10 hover:border-white/25"
          : "border-stone-200 bg-white text-stone-800 hover:bg-stone-100 hover:border-stone-300"
      }`}
    >
      <FaGithub size={15} />
      <span className="text-xs">Star</span>
      <span
        className={`flex items-center gap-1 border-l pl-2 text-xs tabular-nums ${
          dark ? "border-white/15" : "border-stone-200"
        }`}
      >
        <FaStar
          size={11}
          className={`text-amber-400 transition-transform duration-500 ${
            bumped ? "scale-125" : "group-hover:rotate-[72deg]"
          }`}
        />
        {count !== null ? count : "—"}
      </span>
    </button>
  );
}

function NavItem({ to, children, dark, hover, setHover }) {
  return (
    <li onMouseEnter={() => setHover(to)}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative block px-3 py-1.5 rounded-full transition-colors ${
            isActive
              ? dark
                ? "text-white"
                : "text-gray-900"
              : dark
              ? "text-white/60 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {hover === to && (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className={`absolute inset-0 rounded-full ${dark ? "bg-white/10" : "bg-black/5"}`}
              />
            )}
            <span className="relative">{children}</span>
            {isActive && (
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-indigo-500" />
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

function ProfileMenu({ dark, onNavigate, user }) {
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

  const linkCls = dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900";
  const itemCls = dark ? "text-white/80 hover:bg-white/5" : "text-stone-700 hover:bg-stone-50";
  const borderCls = dark ? "border-white/10" : "border-stone-100";

  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  const items = isAdmin
    ? [
        { to: "/admin", icon: <FiShield size={14} />, label: "Admin Panel" },
        { to: "/profile/me", icon: <FiUser size={14} />, label: "My profile" },
        { to: "/connect", icon: <FiUsers size={14} />, label: "Campus directory" },
      ]
    : [
        { to: "/profile/me", icon: <FiUser size={14} />, label: "My profile" },
        { to: "/connect", icon: <FiUsers size={14} />, label: "Campus directory" },
        { to: "/spotlight", icon: <FiStar size={14} />, label: "Spotlight" },
      ];

  return (
    <div ref={ref} className="relative z-[60]">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${linkCls}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {isAdmin ? (
          <>
            <FiShield size={14} className="text-indigo-400" /> Admin
          </>
        ) : (
          "Profile"
        )}
        <FiChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
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
            {items.map((it, i) => (
              <Link
                key={it.to}
                to={it.to}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  i ? `border-t ${borderCls}` : ""
                } ${itemCls}`}
              >
                {it.icon} {it.label}
              </Link>
            ))}
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
  const [hover, setHover] = useState(null);
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
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
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

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const links = [...PUBLIC_LINKS, ...(user ? MEMBER_LINKS : [DOCS_LINK])];

  const mobileLink = `px-4 py-3 rounded-2xl text-sm font-medium opacity-80 hover:opacity-100 transition-colors ${
    dark ? "hover:bg-white/5" : "hover:bg-black/5"
  }`;
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <div ref={menuRef} className="relative w-full max-w-5xl pointer-events-auto">
        <nav
          className={`relative flex items-center justify-between gap-4 rounded-full px-4 sm:px-5 py-2.5 border backdrop-blur-md transition-all duration-500 ${
            dark ? "bg-white/[0.06] border-white/10 text-white" : "bg-white/70 border-black/5 text-gray-900"
          } ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)]" : ""}`}
        >
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-lg shrink-0">
            <span
              className={`grid place-items-center w-7 h-7 rounded-lg text-sm transition-colors duration-500 ${
                dark ? "bg-white text-[#1e1b4b]" : "bg-[#1e1b4b] text-white"
              }`}
            >
              C
            </span>
            CollegeBuddy
          </Link>

          <ul onMouseLeave={() => setHover(null)} className="hidden md:flex items-center text-sm font-medium">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} dark={dark} hover={hover} setHover={setHover}>
                {l.label}
              </NavItem>
            ))}
            {user && (
              <li onMouseEnter={() => setHover(null)}>
                <ProfileMenu dark={dark} user={user} />
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <GitHubWidget dark={dark} />
            {user ? (
              <button
                onClick={handleLogout}
                className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${
                  dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-gray-900 hover:bg-black/10"
                }`}
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  className={`text-sm font-semibold transition-colors ${
                    dark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors duration-500 ${
                    dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"
                  }`}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`md:hidden relative w-9 h-9 rounded-full grid place-items-center transition-colors ${
              dark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            <span
              className={`absolute h-[2px] w-4 rounded bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-[2px] w-4 rounded bg-current transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>

          <div className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden rounded-b-full">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-violet-400 to-orange-400 opacity-80"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden absolute left-0 right-0 top-full mt-2 rounded-3xl border p-3 backdrop-blur-xl shadow-2xl ${
                dark ? "bg-[#14121f]/95 border-white/10 text-white" : "bg-white/95 border-black/5 text-gray-900"
              }`}
            >
              <div className="flex flex-col">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className={mobileLink}>
                    {l.label}
                  </Link>
                ))}
                {user && (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className={`${mobileLink} text-indigo-500 font-bold`}>
                        <FiShield size={14} className="inline mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/profile/me" className={mobileLink}>
                      My profile
                    </Link>
                    <Link to="/connect" className={mobileLink}>
                      Campus directory
                    </Link>
                    {!isAdmin && (
                      <Link to="/spotlight" className={mobileLink}>
                        Spotlight
                      </Link>
                    )}
                  </>
                )}
                <div className={`my-2 h-px ${dark ? "bg-white/10" : "bg-black/5"}`} />
                <div className="px-1 py-1">
                  <GitHubWidget dark={dark} />
                </div>
                <div className={`my-2 h-px ${dark ? "bg-white/10" : "bg-black/5"}`} />
                {user ? (
                  <button onClick={handleLogout} className={`text-left ${mobileLink} font-semibold`}>
                    Log out
                  </button>
                ) : (
                  <div className="flex gap-2 p-1">
                    <Link
                      to="/auth"
                      className={`flex-1 text-center rounded-full py-2.5 text-sm font-semibold border ${
                        dark ? "border-white/15" : "border-black/10"
                      }`}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      className={`flex-1 text-center rounded-full py-2.5 text-sm font-semibold ${
                        dark ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      Get started
                    </Link>
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