// client/src/pages/DocsPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];
const GITHUB_REPO = "https://github.com/pie-1/buddy";

const SECTIONS = [
  { id: "manifesto", label: "Manifesto" },
  { id: "quickstart", label: "Quickstart" },
  { id: "pillars", label: "What's inside" },
  { id: "verification", label: "Verification" },
  { id: "spotlight", label: "The Spotlight" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contribute", label: "Contribute" },
  { id: "faq", label: "FAQ" },
];

const PILLARS = [
  { icon: "🛒", title: "Marketplace", desc: "Buy, sell, rent, or borrow with verified students. Payments happen in person." },
  { icon: "🏠", title: "Roommates", desc: "Post your profile. Match on area, budget, and habits. See rooms on a map." },
  { icon: "📡", title: "Events", desc: "Hackathons, fests, workshops on one feed. RSVP. Find teammates." },
  { icon: "🤝", title: "Connect", desc: "Cross-department chat. Ask a senior. Find a hackathon teammate." },
  { icon: "📚", title: "Resources", desc: "Past papers, lab manuals, study guides — shared by verified seniors." },
  { icon: "🆘", title: "Help board", desc: "Ask the campus for study help, notes, or guidance. Replies, resolve." },
];

const STEPS = [
  { n: "01", title: "Sign up with your university email", desc: "We check the domain belongs to a supported university (TU, PU, PoU, or admin-approved)." },
  { n: "02", title: "Enter the 6-digit code", desc: "A one-time code sent to your inbox proves it's really yours." },
  { n: "03", title: "Your campus node unlocks", desc: "A verified profile, a trust score, and access to every feature." },
];

const SPOTLIGHT_STEPS = [
  { n: "01", title: "Pay Rs. 50 via eSewa", desc: "Any student can claim a slot. Payment verified automatically." },
  { n: "02", title: "Slot assigned Mon–Sun", desc: "First 3 verified payments each week take the 3 slots." },
  { n: "03", title: "Rank first across the platform", desc: "Profile, listings, roommate post, and team requests rank first for one week." },
];

const ROADMAP = [
  { status: "shipped", label: "Shipped", items: ["Marketplace with escrow", "Roommates with map view", "Events with team requests", "Verification via .edu.np", "Spotlight (Rs. 50)"] },
  { status: "progress", label: "In Progress", items: ["Common Ground recommendation engine", "Admin panel with domain approval", "Alumni registration", "Chat with read receipts"] },
  { status: "wanted", label: "Help Wanted", items: ["Mobile app (React Native)", "Push notifications", "Advanced search with filters", "Dispute resolution flow", "Write more tests"] },
];

const GIT = `git clone ${GITHUB_REPO}.git
cd buddy
cp server/.env.example server/.env
cd client && npm install
cd ../server && npm install
npm run dev`;

const FAQ = [
  { q: "Which emails can I use?", a: "Verified university emails from TU, PU, PoU, or any admin-approved domain. We check so every account is a real student." },
  { q: "Do you handle payments?", a: "No. Trades happen in person. The only payment we touch is the Rs. 50 spotlight fee." },
  { q: "What is the spotlight?", a: "Rs. 50 gets your profile, listings, roommate post, and team requests ranked first across the platform for one week." },
  { q: "Who reviews contributions?", a: "Only ACIT Research Chair members merge PRs. Maintainers are listed in CODEOWNERS." },
  { q: "Is it open source?", a: "Yes. Fork it, build on it, send a PR." },
];

function Section({ id, eyebrow, title, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="scroll-mt-32 mb-20"
    >
      {eyebrow && <p className="text-indigo-600 text-[11px] tracking-[0.3em] uppercase font-bold mb-3">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a2e] mb-5">{title}</h2>
      {children}
    </motion.section>
  );
}

function CopyBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  return (
    <div className="relative mt-6 rounded-xl bg-black/40 border border-white/10">
      <button onClick={copy} className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors">
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 pr-20 text-[12.5px] leading-relaxed text-indigo-100 font-mono">{code}</pre>
    </div>
  );
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-[#1a1a2e]">{q}</span>
        <span className={`text-xl text-indigo-600 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-20% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-indigo-500 to-orange-400 z-[60]" />

      <div className="max-w-6xl mx-auto pt-40 px-6 pb-32">
        <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="max-w-3xl mb-20">
          <p className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-4">Open source · MIT licensed</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1a1a2e] mb-6 leading-[1.05]">
            A verified campus <br /> <span className="italic text-indigo-600">network for Nepal.</span>
          </h1>
          <p className="text-xl text-gray-500">
            For students, by students. Built by the ACIT Research Chair, contributed by anyone.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">
          <aside className="hidden lg:block">
            <nav className="sticky top-32" aria-label="On this page">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 mb-4">On this page</p>
              <ul className="border-l border-gray-200">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={`relative block -ml-px pl-4 py-2 text-sm border-l-2 transition-colors ${active === s.id ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="max-w-3xl">
            <Section id="manifesto" eyebrow="01" title="The manifesto">
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                Campus life in Nepal is fragmented. Students trade, find roommates, and organise events through unverified Facebook groups. There is no central space that verifies a person is actually a student. The result: scams, ghost listings, wasted time, and a lonely first month.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                CollegeBuddy unifies the campus experience behind one gate: your university email. Verified students. Verified trades. Verified help. Chat running through all of it, so conversations always happen in context.
              </p>
            </Section>

            <Section id="quickstart" eyebrow="02" title="Quickstart for contributors">
              <p className="text-gray-600 leading-relaxed mb-4">
                Clone the repo, set up your environment, and be running locally in under 5 minutes. Node 18+ required.
              </p>
              <div className="bg-[#14121f] text-white p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm mb-4">Run these commands in order:</p>
                <CopyBlock code={GIT} />
                <p className="text-gray-400 text-xs mt-4">Then open <code className="text-indigo-300">http://localhost:5173</code>. Backend runs on <code className="text-indigo-300">:5000</code>.</p>
              </div>
            </Section>

            <Section id="pillars" eyebrow="03" title="What's inside">
              <div className="grid sm:grid-cols-2 gap-4">
                {PILLARS.map((p, i) => (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }} whileHover={{ y: -3 }} className="rounded-2xl bg-white border border-black/5 p-5">
                    <div className="text-2xl mb-3">{p.icon}</div>
                    <h3 className="font-serif font-bold text-lg text-[#1a1a2e] mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section id="verification" eyebrow="04" title="How verification works">
              <ol className="relative border-l border-indigo-200 ml-3 space-y-8">
                {STEPS.map((s) => (
                  <li key={s.n} className="pl-8 relative">
                    <span className="absolute -left-[13px] top-0 w-[26px] h-[26px] rounded-full bg-indigo-600 text-white text-[10px] font-bold grid place-items-center">{s.n}</span>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="spotlight" eyebrow="05" title="The Spotlight">
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                The only paid feature. Rs. 50 puts you at the top of every feed for one week — profile, listings, roommate post, team requests.
              </p>
              <ol className="relative border-l border-purple-200 ml-3 space-y-8">
                {SPOTLIGHT_STEPS.map((s) => (
                  <li key={s.n} className="pl-8 relative">
                    <span className="absolute -left-[13px] top-0 w-[26px] h-[26px] rounded-full bg-purple-600 text-white text-[10px] font-bold grid place-items-center">{s.n}</span>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="roadmap" eyebrow="06" title="Roadmap · where you can help">
              <p className="text-gray-600 leading-relaxed mb-6">
                Every open-source project lives on contributions. Here's where we are and where we're going.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ROADMAP.map((col) => (
                  <div key={col.status} className={`rounded-2xl border p-5 ${
                    col.status === "shipped" ? "bg-emerald-50 border-emerald-200" :
                    col.status === "progress" ? "bg-amber-50 border-amber-200" :
                    "bg-indigo-50 border-indigo-200"
                  }`}>
                    <div className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${
                      col.status === "shipped" ? "text-emerald-700" :
                      col.status === "progress" ? "text-amber-700" :
                      "text-indigo-700"
                    }`}>{col.label}</div>
                    <ul className="space-y-2">
                      {col.items.map((it) => (
                        <li key={it} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                          <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-gray-400" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="contribute" eyebrow="07" title="Contribute">
              <div className="bg-[#14121f] text-white p-8 rounded-3xl border border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Maintained by ACIT Research Chair. Anyone can fork, build, and submit a PR — only RC members merge.
                </p>
                <ul className="space-y-4 text-sm mb-6">
                  {[
                    "Fork the repo on GitHub.",
                    "Create a feature branch (feat/your-feature).",
                    "Submit a PR. Reviewers are in CODEOWNERS.",
                    "Follow the Code of Conduct. Be kind.",
                  ].map((t, i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-indigo-400 font-mono">0{i + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="inline-block mt-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  View GitHub Repo →
                </a>
              </div>
            </Section>

            <Section id="faq" eyebrow="08" title="FAQ">
              <div className="border-t border-gray-200">
                {FAQ.map((f) => <Faq key={f.q} {...f} />)}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}