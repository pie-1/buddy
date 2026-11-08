// client/src/pages/AuthPage.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import AuthShowcase from "../components/ui/AuthShowcase";

const EASE = [0.22, 1, 0.36, 1];
const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10 transition-all";
const LABEL = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5";

const COPY = {
  login: { title: "Welcome back", sub: "Enter your credentials to access your campus.", cta: "Sign in" },
  signup: { title: "Join CollegeBuddy", sub: "Use your university email to get started.", cta: "Create account" },
  verify: { title: "Verify your email", sub: "", cta: "Verify email" },
};

const STRENGTH = ["Too short", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLOR = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-lime-400", "bg-emerald-400"];
function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function Collapse({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([]);
  useEffect(() => refs.current[Math.min(value.length, 5)]?.focus(), []);

  const focus = (i) => refs.current[Math.max(0, Math.min(5, i))]?.focus();
  const handle = (i, raw) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) { onChange(value.slice(0, i) + value.slice(i + 1)); return; }
    const next = (value.slice(0, i) + digits).slice(0, 6);
    onChange(next);
    focus(i + digits.length);
  };

  return (
    <div className="flex justify-between gap-2" onPaste={(e) => {
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted) { e.preventDefault(); onChange(pasted); focus(pasted.length); }
    }}>
      {Array.from({ length: 6 }, (_, i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)} value={value[i] || ""} onChange={(e) => handle(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i]) focus(i - 1);
            if (e.key === "ArrowLeft") focus(i - 1);
            if (e.key === "ArrowRight") focus(i + 1);
          }}
          onFocus={(e) => e.target.select()} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`} disabled={disabled} maxLength={6}
          className={`w-full aspect-square max-w-[52px] text-center text-2xl font-mono text-white bg-white/5 border rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all ${value[i] ? "border-indigo-500/60" : "border-white/10"}`}
        />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", graduationYear: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const card = useAnimationControls();
  const formRef = useRef(null);

  const { user, login, register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, from, navigate]);
  useEffect(() => { card.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }); }, [card]);

  const year = new Date().getFullYear();
  const pwScore = strength(formData.password);
  const emailLooksOff = mode === "signup" && formData.email.includes("@") && !/\.edu\.np$/i.test(formData.email.trim());

  const switchMode = (next) => { setMode(next); setError(""); setShowPassword(false); };
  const handleChange = (e) => { setFormData((f) => ({ ...f, [e.target.name]: e.target.value })); setError(""); };
  const fail = (message) => { setError(message || "Something went wrong. Please try again."); card.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError("");
    const email = formData.email.trim().toLowerCase();

    try {
      if (mode === "login") {
        const res = await login(email, formData.password);
        if (!res.success) fail(res.message);
      } else if (mode === "signup") {
        const res = await register({ name: formData.name.trim(), email, password: formData.password, graduationYear: Number(formData.graduationYear) });
        if (res.success) {
          setFormData((f) => ({ ...f, email, otp: "" }));
          setMode("verify");
          if (import.meta.env.DEV) setError("DEV MODE: Check your terminal for the OTP.");
        } else fail(res.message);
      } else {
        const res = await verifyOTP(email, formData.otp);
        if (!res.success) { fail(res.message); setFormData((f) => ({ ...f, otp: "" })); }
      }
    } catch { fail("Network error. Check your connection and try again."); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (mode === "verify" && formData.otp.length === 6 && !loading) formRef.current?.requestSubmit(); }, [formData.otp, mode]);
  const copy = COPY[mode];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex relative overflow-hidden" data-nav-theme="dark">
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,.22), transparent 65%)" }} />
      <div className="absolute top-[10%] left-[8%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,.1), transparent 65%)" }} />

      <main className="relative z-10 flex-1 min-w-0 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Back to home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={card} className="p-7 sm:p-8 bg-[#14121f]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-[#1e1b4b] font-serif font-black text-xl mb-4 shadow-lg shadow-white/10">C</div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <h1 className="text-3xl font-serif font-bold mb-2">{copy.title}</h1>
                  <p className="text-sm text-gray-400">
                    {mode === "verify" ? <>We sent a 6-digit code to <span className="text-white font-medium">{formData.email}</span></> : copy.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className={`mb-5 p-3 rounded-lg border text-sm text-center ${error.startsWith("DEV MODE") ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit}>
              <Collapse show={mode === "signup"}>
                <label htmlFor="name" className={LABEL}>Full name</label>
                <input id="name" type="text" name="name" required={mode === "signup"} autoComplete="name" value={formData.name} onChange={handleChange} className={INPUT} placeholder="Pawan Singh" />
              </Collapse>

              <Collapse show={mode !== "verify"}>
                <label htmlFor="email" className={LABEL}>University email</label>
                <input id="email" type="email" name="email" required={mode !== "verify"} autoComplete="email" value={formData.email} onChange={handleChange} className={INPUT} placeholder="pawan@acme.edu.np" />
                <AnimatePresence>
                  {emailLooksOff && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-amber-400">
                      Heads up: university emails usually end in .edu.np
                    </motion.p>
                  )}
                </AnimatePresence>
              </Collapse>

              <Collapse show={mode === "signup"}>
                <label htmlFor="graduationYear" className={LABEL}>Graduation year</label>
                <input id="graduationYear" type="number" name="graduationYear" required={mode === "signup"} min={year} max={year + 8} value={formData.graduationYear} onChange={handleChange} className={INPUT} placeholder={String(year + 1)} />
              </Collapse>

              <Collapse show={mode !== "verify"}>
                <label htmlFor="password" className={LABEL}>Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} name="password" required={mode !== "verify"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={formData.password} onChange={handleChange} onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)} className={`${INPUT} pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {capsOn && <p className="mt-1.5 text-xs text-amber-400">Caps Lock is on</p>}
                {mode === "signup" && formData.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((n) => (<span key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${pwScore >= n ? STRENGTH_COLOR[pwScore] : "bg-white/10"}`} />))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-500">{STRENGTH[pwScore]}. Use 8+ characters, mixed case, a number and a symbol.</p>
                  </div>
                )}
              </Collapse>

              <Collapse show={mode === "verify"}>
                <label className={LABEL}>Verification code</label>
                <OtpInput value={formData.otp} onChange={(otp) => { setFormData((f) => ({ ...f, otp })); setError(""); }} disabled={loading} />
                <button type="button" onClick={() => switchMode("signup")} className="mt-4 text-xs text-gray-500 hover:text-white transition-colors">Wrong email? Go back and edit it</button>
              </Collapse>

              <motion.button type="submit" disabled={loading || (mode === "verify" && formData.otp.length < 6)} whileHover={loading ? undefined : { y: -1 }} whileTap={{ scale: 0.985 }} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_24px_rgba(79,70,229,0.35)] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (<><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing…</>) : (<>{copy.cta} <ArrowRight size={16} /></>)}
              </motion.button>
            </form>

            {mode !== "verify" && (
              <p className="mt-6 text-center text-sm text-gray-400">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence initial={false}>
        {mode === "login" && (
          <motion.aside
            key="showcase"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="hidden lg:block relative shrink-0 overflow-hidden border-l border-white/10"
          >
            <div className="absolute inset-y-0 right-0 w-[50vw]">
              <AuthShowcase />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}