// client/src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, animate, useReducedMotion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

const ADMIN_TILES = [
  { title: "Spotlight Claims", desc: "Verify Rs. 50 eSewa payments and assign weekly slots.", to: "/dashboard/spotlight", accent: "text-orange-300", highlight: true },
  { title: "Verification Queue", desc: "Approve new student domains.", to: null, accent: "text-indigo-300" },
  { title: "Moderation", desc: "Reported listings and chats.", to: null, accent: "text-red-300" },
  { title: "Disputes", desc: "Unresolved transactions.", to: null, accent: "text-cyan-300" },
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

function AdminDashboard({ user }) {
  return (
    <div data-nav-theme="dark" className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(79,70,229,.2), transparent 65%)" }} />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,.07), transparent 65%)" }} />
      <Navbar />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-6">
        <motion.div initial="hidden" animate="show" variants={container}>
          <motion.div variants={item} className="mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Restricted access
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Admin control panel</h1>
            <p className="text-gray-400">{user.university} Node · {user.name}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADMIN_TILES.map((t) => {
              const cardBody = (
                <>
                  <h3 className="text-lg font-bold mb-1">{t.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{t.desc}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <CountUp to={0} className={`text-4xl font-black ${t.accent}`} />
                    {t.to ? (
                      <span className="text-[11px] font-bold text-indigo-300">Open →</span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-400">All clear ✓</span>
                    )}
                  </div>
                </>
              );
              return t.to ? (
                <motion.div key={t.title} variants={item} whileHover={{ y: -4 }}>
                  <Link
                    to={t.to}
                    className={`bg-[#14121f] border rounded-2xl p-6 flex flex-col h-full transition-colors ${
                      t.highlight ? "border-purple-500/40 hover:border-purple-400" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {cardBody}
                  </Link>
                </motion.div>
              ) : (
                <motion.div key={t.title} variants={item} whileHover={{ y: -4 }} className="bg-[#14121f] border border-white/10 rounded-2xl p-6 flex flex-col">
                  {cardBody}
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={item} className="mt-10 bg-[#14121f] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Role</div>
                <div className="text-white font-bold capitalize">{user.role}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">University</div>
                <div className="text-white font-bold">{user.university}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Profile</div>
                <Link to={`/profile/${user._id}`} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  View public profile →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  // Students are redirected to their profile — that's their dashboard now
  if (user.role === "student") {
    return <Navigate to="/profile/me" replace />;
  }

  return <AdminDashboard user={user} />;
}