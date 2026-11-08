// client/src/pages/DocsPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];

const SECTIONS = [
  { id: "problem", label: "The problem" },
  { id: "solution", label: "The solution" },
  { id: "pillars", label: "What's inside" },
  { id: "verification", label: "How verification works" },
  { id: "contribute", label: "Governance & PRs" },
  { id: "faq", label: "FAQ" },
];

const PILLARS = [
  { icon: "🛒", title: "Marketplace", desc: "Buy and sell with verified students, with escrow so nobody sends “advance” to a stranger." },
  { icon: "📚", title: "Borrow & Lend", desc: "Lend books and gear with a trust score behind every return." },
  { icon: "🏠", title: "Roommates", desc: "Find flatmates who fit, from people at your own campus." },
  { icon: "📡", title: "Events", desc: "Hack nights, fests and open mics on one feed." },
  { icon: "🤝", title: "Project teammates", desc: "Find collaborators across colleges, not just your own class." },
];

const STEPS = [
  { n: "01", title: "Sign up with your university email", desc: "We check it belongs to a supported university (TU, PU, PoU)." },
  { n: "02", title: "Enter the 6-digit code", desc: "A one-time code proves the inbox is really yours." },
  { n: "03", title: "Your campus node unlocks", desc: "You get a Buddy Pass and a trust score that grows as you trade." },
];

const GIT = `git clone https://github.com/<your-username>/<repo>.git
git checkout -b feat/your-feature
git add . && git commit -m "feat: your feature"
git push origin feat/your-feature`;

const FAQ = [
  { q: "Which emails can I use?", a: "Verified university emails from TU, PU and PoU. We verify the domain so every account is a real student." },
  { q: "Why verify at all?", a: "Unverified groups are where scams thrive. A verified network means people on the other side of a trade are who they say they are." },
  { q: "Who reviews contributions?", a: "The platform is governed by the ACIT Research Chair. Only Research Chair members can review and merge pull requests." },
  { q: "Is it open source?", a: "Yes. Fork it, build on it, and send a pull request." },
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
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
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

  // scroll-spy: highlight the section nearest the top third of the viewport
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-indigo-500 to-orange-400 z-[60]" />

      <div className="max-w-6xl mx-auto pt-40 px-6 pb-32">
        <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="max-w-3xl mb-20">
          <p className="text-indigo-600 text-xs tracking-[0.3em] uppercase font-bold mb-4">Open source</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1a1a2e] mb-6 leading-[1.05]">
            The CollegeBuddy <br /> <span className="italic text-indigo-600">Manifesto.</span>
          </h1>
          <p className="text-xl text-gray-500">
            Building a verified campus network for Nepal, governed by the ACIT Research Chair. Transparent, open, and built for students.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">
          {/* table of contents */}
          <aside className="hidden lg:block">
            <nav className="sticky top-32" aria-label="On this page">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 mb-4">On this page</p>
              <ul className="border-l border-gray-200">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`relative block -ml-px pl-4 py-2 text-sm border-l-2 transition-colors ${
                        active === s.id ? "border-indigo-600 text-indigo-600 font-semibold" : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="max-w-3xl">
            <Section id="problem" eyebrow="01" title="The problem">
              <p className="text-gray-600 leading-relaxed text-lg">
                Campus life is fragmented. Students use unverified Facebook groups to buy, sell, and find roommates, leading to scams and mistrust. There is no central, verified space for students across different colleges to connect.
              </p>
            </Section>

            <Section id="solution" eyebrow="02" title="The solution">
              <p className="text-gray-600 leading-relaxed text-lg">
                CollegeBuddy unifies the campus experience. By strictly verifying university emails (TU, PU, PoU), we create a trusted space for the Marketplace, Roommates, Events, and Project Teammates.
              </p>
            </Section>

            <Section id="pillars" eyebrow="03" title="What's inside">
              <div className="grid sm:grid-cols-2 gap-4">
                {PILLARS.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                    whileHover={{ y: -3 }}
                    className="rounded-2xl bg-white border border-black/5 p-5"
                  >
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

            <Section id="contribute" title="Governance & PRs">
              <div className="bg-[#14121f] text-white p-8 rounded-3xl border border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">This platform is maintained by the Research Chair Club. To contribute:</p>
                <ul className="space-y-4 text-sm">
                  {[
                    "Fork the repository from GitHub.",
                    "Create a feature branch (feat/your-feature).",
                    "Submit a Pull Request. Only ACIT Research Chair members can review and merge.",
                  ].map((t, i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-indigo-400 font-mono">0{i + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <CopyBlock code={GIT} />
                <a href="#" className="inline-block mt-8 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  View GitHub Repo
                </a>
              </div>
            </Section>

            <Section id="faq" eyebrow="05" title="FAQ">
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