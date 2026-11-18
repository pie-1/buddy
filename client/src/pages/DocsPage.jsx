import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";

const EASE = [0.22, 1, 0.36, 1];
const GITHUB_REPO = "https://github.com/pie-1/buddy";
const ISSUES = `${GITHUB_REPO}/issues`;

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "setup", label: "Local setup" },
  { id: "contribute", label: "Contributing" },
  { id: "standards", label: "Standards" },
];

const SETUP_STEPS = [
  {
    n: "01",
    title: "Clone and install",
    code: `git clone https://github.com/pie-1/buddy.git
cd buddy

cd server && npm install
cd ../client && npm install`,
  },
  {
    n: "02",
    title: "Configure environment",
    code: `# server/.env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/buddy
JWT_SECRET=your_secret
ADMIN_INVITE_CODE=your_code
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# client/.env
VITE_API_URL=http://localhost:5000/api`,
  },
  {
    n: "03",
    title: "Run both servers",
    code: `# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev`,
  },
];

const CONTRIB_STEPS = [
  { n: "01", title: "Find an issue", desc: "Browse GitHub Issues. Look for `good first issue` labels." },
  { n: "02", title: "Claim it", desc: "Comment on the issue so maintainers know you're on it." },
  { n: "03", title: "Fork & branch", desc: "Fork the repo, then create a branch: `feature/your-thing`." },
  { n: "04", title: "Build & test", desc: "Follow the code style. Run both servers. Test your change." },
  { n: "05", title: "Commit & push", desc: "Use Conventional Commits. Push to your fork." },
  { n: "06", title: "Open a PR", desc: "Link the issue. Describe what and why." },
];

const COMMIT_TYPES = [
  ["feat", "New feature"],
  ["fix", "Bug fix"],
  ["docs", "Documentation"],
  ["style", "Formatting"],
  ["refactor", "Code restructuring"],
  ["test", "Tests"],
  ["chore", "Tooling / maintenance"],
];

function Section({ id, eyebrow, title, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="scroll-mt-32 mb-20"
    >
      <p className="text-indigo-600 text-[10px] tracking-[0.3em] uppercase font-bold mb-2">{eyebrow}</p>
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
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="relative mt-3 rounded-xl bg-[#14121f] border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Shell</span>
        <button
          type="button"
          onClick={copy}
          className="text-[11px] font-semibold text-indigo-300 hover:text-white transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-indigo-100 font-mono">
        <code>{code}</code>
      </pre>
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
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-indigo-500 to-orange-400 z-[60]"
      />

      <main className="max-w-5xl mx-auto pt-36 md:pt-40 px-6 pb-32">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-indigo-600 text-[10px] tracking-[0.3em] uppercase font-bold">
              Docs 
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1a1a2e] leading-[1.05] mb-5">
            Build with us.
            <br />
            <span className="italic text-indigo-600">Ship your first PR.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Everything you need to run CollegeBuddy locally and contribute to the project.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#171525] text-white text-sm font-semibold rounded-lg hover:bg-indigo-900 transition-colors"
            >
              View on GitHub ↗
            </a>
            <a
              href={ISSUES}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white border border-gray-200 text-[#1a1a2e] text-sm font-semibold rounded-lg hover:border-indigo-300 transition-colors"
            >
              Find an issue
            </a>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-10 lg:gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-32" aria-label="On this page">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 mb-4">
                On this page
              </p>
              <ul className="border-l border-gray-200">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`relative block -ml-px pl-4 py-2.5 text-sm border-l-2 transition-colors ${
                        active === s.id
                          ? "border-indigo-600 text-indigo-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="max-w-3xl min-w-0">
            {/* 01. Overview */}
            <Section id="overview" eyebrow="01 / Overview" title="What is CollegeBuddy?">
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                A verified campus network for students in Nepal. One place for marketplace,
                roommates, events, teams, and connections — behind a university email gate.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  ["Verified", "University email required."],
                  ["Unified", "One inbox across all features."],
                  ["Open source", "MIT licensed. Fork it."],
                ].map(([title, desc]) => (
                  <div key={title} className="p-4 bg-white border border-gray-100 rounded-xl">
                    <h3 className="font-serif text-lg font-bold text-[#1a1a2e] mb-1">{title}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 02. Local setup */}
            <Section id="setup" eyebrow="02 / Local setup" title="Run it locally">
              <p className="text-gray-600 leading-relaxed mb-6">
                You'll need Node.js 18+, npm, and a MongoDB Atlas account (free tier works). 
                See <a href="#contribute" className="text-indigo-600 font-semibold">the contributing section</a> if you're stuck.
              </p>
              <div className="space-y-6">
                {SETUP_STEPS.map((step) => (
                  <div key={step.n}>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">
                      <span className="text-indigo-500 font-mono text-sm mr-2">{step.n}</span>
                      {step.title}
                    </h3>
                    <CopyBlock code={step.code} />
                  </div>
                ))}
              </div>
            </Section>

            {/* 03. Contributing */}
            <Section id="contribute" eyebrow="03 / Contributing" title="Your first PR">
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {CONTRIB_STEPS.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                    className="p-4 bg-white border border-gray-100 rounded-xl"
                  >
                    <span className="text-[10px] font-mono text-indigo-500 font-bold">{step.n}</span>
                    <h4 className="font-semibold text-[#1a1a2e] mt-1 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={ISSUES}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#171525] text-white text-sm font-semibold rounded-lg hover:bg-indigo-900 transition-colors"
                >
                  Browse issues ↗
                </a>
                <a
                  href={`${GITHUB_REPO}/pulls`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white border border-gray-200 text-[#1a1a2e] text-sm font-semibold rounded-lg hover:border-indigo-300 transition-colors"
                >
                  See open PRs ↗
                </a>
              </div>
            </Section>

            {/* 04. Standards */}
            <Section id="standards" eyebrow="04 / Standards" title="Code & commit conventions">
              <div className="mb-8">
                <h3 className="font-serif text-xl font-bold text-[#1a1a2e] mb-3">
                  Conventional Commits
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {COMMIT_TYPES.map(([type, desc]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 border-gray-100"
                    >
                      <code className="text-sm text-indigo-600 font-bold">{type}:</code>
                      <span className="text-sm text-gray-500">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#1a1a2e] mb-3">
                  Before you open a PR
                </h3>
                <ul className="space-y-2 p-5 rounded-xl bg-white border border-gray-200">
                  {[
                    "Both frontend and backend run locally",
                    "No console errors or warnings in changed files",
                    "No .env files or secrets committed",
                    "Commits follow Conventional Commits",
                    "PR description links the issue",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-emerald-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-400 flex flex-col sm:flex-row justify-between gap-3">
              <span>© CollegeBuddy </span>
              <span>Maintained by students</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}