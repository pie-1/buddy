// client/src/pages/DocsPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];
const GITHUB_REPO = "https://github.com/pie-1/buddy";

const SECTIONS = [
  { id: "problem", label: "The problem" },
  { id: "solution", label: "The solution" },
  { id: "pillars", label: "What's inside" },
  { id: "verification", label: "How verification works" },
  { id: "spotlight", label: "The Spotlight" },
  { id: "contribute", label: "Governance & PRs" },
  { id: "faq", label: "FAQ" },
];

const PILLARS = [
  { icon: "🛒", title: "Marketplace", desc: "Buy, sell, rent, or borrow with verified students — cost and deadline shown upfront. Payments happen in person, by mutual agreement." },
  { icon: "🏠", title: "Roommates", desc: "Post your own profile: 'I have a room' or 'I'm looking for a room'. Match on area, budget, and habits." },
  { icon: "📡", title: "Events", desc: "Hackathons, fests, workshops on one feed. RSVP, add to calendar, and post team requests to find teammates." },
  { icon: "🤝", title: "Project teammates", desc: "Post your project and the roles you need. Apply to others'. Accept in-app." },
  { icon: "💬", title: "Unified chat", desc: "Every listing, roommate profile, event and project has its own thread. Chat is the spine of the platform." },
  { icon: "🆘", title: "Help board", desc: "Ask the campus for study help, project guidance, notes, or any question. Replies, resolve, done." },
];

const STEPS = [
  { n: "01", title: "Sign up with your university email", desc: "We check it belongs to a supported university (TU, PU, or PoU) — the only way in." },
  { n: "02", title: "Enter the 6-digit code", desc: "A one-time code sent to your inbox proves it's really yours." },
  { n: "03", title: "Your campus node unlocks", desc: "You get a verified profile, a trust score, and access to every feature — scoped to your campus." },
];

const SPOTLIGHT_STEPS = [
  { n: "01", title: "Pay Rs. 50 via eSewa", desc: "Any student can claim a slot. Payment is verified automatically via the eSewa merchant API." },
  { n: "02", title: "Slot assigned Mon–Sun", desc: "The first 3 verified payments each week take the 3 slots. Empty slots fall back to the highest activity score." },
  { n: "03", title: "Rank first across the platform", desc: "Their profile, listings, roommate post, and team requests appear first on every feed for the week." },
];

const GIT = `git clone ${GITHUB_REPO}.git
git checkout -b feat/your-feature
git add . && git commit -m "feat: your feature"
git push origin feat/your-feature`;

const FAQ = [
  { q: "Which emails can I use?", a: "Verified university emails from Tribhuvan University (TU), Pokhara University (PoU), and Purbanchal University (PU). We check the domain so every account is a real student." },
  { q: "Why verify at all?", a: "Unverified groups are where scams thrive. A verified network means the person on the other side of a trade is who they say they are." },
  { q: "Do you handle payments?", a: "No. Payments for trades happen in person, by mutual agreement. Every cost and deadline is displayed upfront. The only payment the platform touches is the Rs. 50 spotlight fee." },
  { q: "What is the spotlight?", a: "Rs. 50 gets your profile, listings, roommate post, and team requests to rank first across the platform for one week. First 3 verified payments each week." },
  { q: "Who reviews contributions?", a: "Only ACIT Research Chair members can review and merge pull requests. The list of maintainers is public in CODEOWNERS." },
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
    } catch { /* clipboard blocked */ }
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
            A verified campus network for Nepal — for students, by students, governed by the ACIT Research Chair.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">
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
                Campus life in Nepal is fragmented. Students trade, find roommates, and organise events through unverified Facebook groups and word of mouth. There is no central space that verifies a person is actually a student. The result: scams, ghost listings, wasted time, and a lonely first month for anyone new.
              </p>
            </Section>

            <Section id="solution" eyebrow="02" title="The solution">
              <p className="text-gray-600 leading-relaxed text-lg">
                CollegeBuddy unifies the campus experience behind one gate: your university email. By verifying the domain, we create a trusted space for the Marketplace, Roommates, Events, Project Teammates, and a shared Help board — with chat running through all of it, so conversations always happen in context.
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

            <Section id="spotlight" eyebrow="05" title="The Spotlight">
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                The only paid feature on the platform. Rs. 50 puts you at the top of every feed for one week — profile, listings, roommate post, and team requests.
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

            <Section id="contribute" title="Governance & PRs">
              <div className="bg-[#14121f] text-white p-8 rounded-3xl border border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  This platform is maintained by the ACIT Research Chair Club. Anyone can fork, build, and submit a pull request — but only Research Chair members can review and merge.
                </p>
                <ul className="space-y-4 text-sm">
                  {[
                    "Fork the repository on GitHub.",
                    "Create a feature branch (feat/your-feature).",
                    "Submit a Pull Request. Reviewers are listed in CODEOWNERS — ping the right person.",
                  ].map((t, i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-indigo-400 font-mono">0{i + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <CopyBlock code={GIT} />
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-8 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View GitHub Repo →
                </a>
              </div>
            </Section>

            <Section id="faq" eyebrow="06" title="FAQ">
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