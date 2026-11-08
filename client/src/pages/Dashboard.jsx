// client/src/pages/Dashboard.jsx
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, animate, useReducedMotion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

// ids match the Navbar links (/dashboard#marketplace …). Set `to` once the route exists; until then the card shows a button.
const MODULES = [
  { id: "marketplace", icon: "🛒", title: "Marketplace", desc: "Your active listings and requests will appear here.", cta: "Browse items", to: null, primary: true },
  { id: "borrow", icon: "📚", title: "Borrow & Lend", desc: "Lend with a trust score. Track what's out and what's back.", cta: "Open ledger", to: null },
  { id: "roommates", icon: "🏠", title: "Roommates", desc: "Find verified flatmates or list your room.", cta: "View posts", to: null },
  { id: "events", icon: "📡", title: "Campus Radar", desc: "Upcoming events, hackathons, and fests.", cta: "Explore events", to: null },
];

const ADMIN_TILES = [
  { title: "Verification Queue", desc: "Approve new student domains.", count: 0, accent: "text-indigo-300" },
  { title: "Spotlight Claims", desc: "Pending eSewa verifications.", count: 0, accent: "text-orange-300" },
  { title: "Moderation", desc: "Reported listings and chats.", count: 0, accent: "text-red-300" },
  { title: "Disputes", desc: "Unresolved transactions.", count: 0, accent: "text-cyan-300" },
];

function CountUp({ to, className = "" }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, to, { duration: 1.2, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to, reduce]);
  return <span className={className}>{v}</span>;
}

function TrustRing({ value = 0 }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative w-[72px] h-[72px] shrink-0">
      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
        <motion.circle
          cx="36" cy="36" r={r} fill="none" stroke="#fb923c" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <CountUp to={pct} className="text-lg font-black text-white" />
      </div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,.2), transparent 65%)" }} />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,.07), transparent 65%)" }} />
      <Navbar />
      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">{children}</div>
    </div>
  );
}

function ModuleCard({ m, highlighted }) {
  const body = (
    <span className="w-full py-2.5 rounded-xl font-bold text-sm text-center transition-colors">{m.cta}</span>
  );
  const btn = `block w-full py-2.5 rounded-xl font-bold text-sm text-center transition-colors ${
    m.primary ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/5 border border-white/10 hover:bg-white/10"
  }`;
  return (
    <motion.section
      id={m.id}
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`scroll-mt-28 relative overflow-hidden bg-[#14121f] border rounded-2xl p-6 min-h-[16rem] flex flex-col justify-between transition-colors duration-500 ${
        highlighted ? "border-indigo-400/70 shadow-[0_0_40px_-8px_rgba(99,102,241,.5)]" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div>
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-xl mb-4">{m.icon}</div>
        <h3 className="text-xl font-bold mb-1.5">{m.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
      </div>
      {m.to ? <Link to={m.to} className={btn}>{m.cta}</Link> : <button type="button" className={btn}>{body}</button>}
    </motion.section>
  );
}

function AdminDashboard({ user }) {
  return (
    <Shell>
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={item} className="mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Restricted access
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Admin control panel</h1>
          <p className="text-gray-400">{user.university} Node</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ADMIN_TILES.map((t) => (
            <motion.div key={t.title} variants={item} whileHover={{ y: -4 }} className="bg-[#14121f] border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold mb-1">{t.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{t.desc}</p>
              <div className="mt-auto flex items-end justify-between">
                <CountUp to={t.count} className={`text-4xl font-black ${t.accent}`} />
                {t.count === 0 && <span className="text-[11px] font-bold text-emerald-400">All clear ✓</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Shell>
  );
}

function StudentDashboard({ user }) {
  const { hash } = useLocation();
  const [highlight, setHighlight] = useState(null);
  const timer = useRef();

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Burning the midnight oil" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = useMemo(() => (user.name || "there").split(" ")[0], [user.name]);

  // /dashboard#events from the navbar: scroll to the card and pulse it
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlight(id);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setHighlight(null), 2200);
    }, 350);
    return () => {
      clearTimeout(t);
      clearTimeout(timer.current);
    };
  }, [hash]);

  const stats = [
    { label: "Active listings", value: 0 },
    { label: "Items lent out", value: 0 },
    { label: "Roommate matches", value: 0 },
    { label: "Events going", value: 0 },
  ];

  return (
    <Shell>
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <p className="text-indigo-400 text-xs tracking-[0.3em] uppercase font-bold mb-3">{greeting}</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Welcome back, {firstName}</h1>
            <p className="inline-flex items-center gap-2 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user.university} Node • {user.isAlumni ? "Alumni Network" : "Current Student"}
            </p>
          </div>

          <div className="flex items-center gap-4 pr-2">
            <TrustRing value={user.trustScore || 0} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">Trust score</div>
              <div className="text-sm text-gray-300 mt-1">Grows with every smooth trade.</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-4">
              <CountUp to={s.value} className="text-3xl font-black text-white" />
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES.map((m) => (
            <ModuleCard key={m.id} m={m} highlighted={highlight === m.id} />
          ))}
        </div>
      </motion.div>
    </Shell>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  if (!user) return null; // ProtectedRoute normally redirects first; this just avoids a crash
  return user.role === "admin" ? <AdminDashboard user={user} /> : <StudentDashboard user={user} />;
}