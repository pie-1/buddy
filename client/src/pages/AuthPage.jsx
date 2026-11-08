// client/src/pages/AuthPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import { AuthContext } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    graduationYear: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const res = await login(formData.email, formData.password);
      if (res.success) navigate("/dashboard");
      else setError(res.message);
    } 
    else if (mode === "signup") {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        graduationYear: Number(formData.graduationYear),
      });
      if (res.success) {
        setMode("verify");
        if (import.meta.env.DEV) setError("DEV MODE: Check your terminal for the OTP.");
      } else setError(res.message);
    } 
    else if (mode === "verify") {
      const res = await verifyOTP(formData.email, formData.otp);
      if (res.success) navigate("/dashboard");
      else setError(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md p-8 bg-[#14121f]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-[#1e1b4b] font-serif font-black text-xl mb-4 shadow-lg shadow-white/10">C</div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Join CollegeBuddy"}
            {mode === "verify" && "Verify Your Email"}
          </h1>
          <p className="text-sm text-gray-400">
            {mode === "login" && "Enter your credentials to access your campus."}
            {mode === "signup" && "Use your university email to get started."}
            {mode === "verify" && `We sent a 6-digit code to ${formData.email}`}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Pawan Singh" />
            </div>
          )}

          {mode !== "verify" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">University Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="pawan@acme.edu.np" />
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Graduation Year</label>
              <input type="number" name="graduationYear" required value={formData.graduationYear} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="2027" />
            </div>
          )}

          {mode !== "verify" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors pr-12" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {mode === "verify" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">OTP Code</label>
              <input type="text" name="otp" required value={formData.otp} onChange={handleChange} maxLength="6" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="000000" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 mt-2">
            {loading ? "Processing..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Verify Email"}
          </button>
        </form>

        {mode !== "verify" && (
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}