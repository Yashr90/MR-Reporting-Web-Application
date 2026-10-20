import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, Phone, AlertCircle, Loader2,
  ArrowRight, Activity, TrendingUp, Users, ShieldCheck,
} from "lucide-react";
import api from "../services/api";

/* ─── Typewriter hook ─────────────────────────────────────── */
function useTypewriter(words, typingSpeed = 80, deletingSpeed = 45, pauseTime = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayed;
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-light text-white tracking-tight">{value}</p>
      <p className="text-[10px] text-blue-300/60 mt-1.5 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}

function HelpRow({ icon: Icon, label, value, href }) {
  return (
    <a href={href} className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200 shrink-0">
        <Icon className="text-blue-600" size={18} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{value}</p>
      </div>
    </a>
  );
}

const TYPEWRITER_WORDS = [
  "Revolutionize", "Streamline", "Simplify", "Transform",
  "Accelerate", "Supercharge", "Modernize", "Optimize",
];

/* ─── Dev quick-access panels config ─────────────────────── */
const DEV_PANELS = [
  {
    role: "ADMIN",
    label: "Admin Panel",
    route: "/admin/dashboard",
    color: "from-[#2563eb] to-[#1d4ed8]",
    shadow: "shadow-blue-500/30",
    initial: "A",
  },
  {
    role: "MANAGER",
    label: "Manager Panel",
    route: "/manager/dashboard",
    color: "from-[#0D9488] to-[#0f766e]",
    shadow: "shadow-teal-500/30",
    initial: "M",
  },
  {
    role: "MR",
    label: "MR Panel",
    route: "/mr/dashboard",
    color: "from-[#F43F5E] to-[#e11d48]",
    shadow: "shadow-rose-500/30",
    initial: "R",
  },
];

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const navigate = useNavigate();

  const typedWord = useTypewriter(TYPEWRITER_WORDS);

  /* ─── Dev bypass: set fake session and go directly ───────── */
  const handleDevAccess = (panel) => {
    sessionStorage.setItem("token", "dev-token-bypass");
    sessionStorage.setItem("role", panel.role);
    navigate(panel.route);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await api.post("/api/users/login", {
        email: username,
        password,
      });
      const token = response?.data?.token;
      const role  = response?.data?.role;
      if (!token || !role) throw new Error("Login response missing token or role.");
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("mr_token");
      sessionStorage.removeItem("mr_user");
      if (role === "ADMIN")        navigate("/admin/dashboard");
      else if (role === "MANAGER") navigate("/manager");
      else if (role === "MR")      navigate("/mr");
      else                         navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 border-[1.5px] border-gray-200 rounded-xl text-gray-900 placeholder-gray-400/60 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/[0.12] hover:border-gray-300 transition-all duration-200 bg-gray-50 focus:bg-white text-sm";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-12 py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center">
            <Activity size={16} className="text-blue-300" />
          </div>
          <span className="text-lg font-light text-white tracking-widest" style={{ fontFamily: "Georgia, serif" }}>
            MR Reporting
          </span>
        </motion.div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <p className="text-2xl font-light text-blue-200/70 mb-2 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              MR Operations
            </p>
            <h2 className="text-5xl lg:text-6xl font-light text-white leading-[1.15] mb-5 min-h-[1.2em]" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-blue-400">{typedWord}</span>
              <span className="inline-block w-[3px] h-[0.85em] bg-blue-400 ml-1 align-middle animate-pulse" />
            </h2>
            <p className="text-base text-blue-200/70 leading-relaxed max-w-md font-light">
              Streamline field operations, track doctor visits, and generate comprehensive analytics with enterprise-grade reliability.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-2 mt-8">
            {[
              { icon: TrendingUp,  label: "Real-time Analytics" },
              { icon: Users,       label: "Team Management" },
              { icon: ShieldCheck, label: "Enterprise Security" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200/80 text-xs font-medium backdrop-blur-sm">
                <Icon size={12} />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="border-l-2 border-blue-400/40 pl-5 mt-12">
            <p className="text-blue-100/80 italic text-sm leading-relaxed font-light">
              "MR Reporting has transformed how we manage field operations. The insights are invaluable for our team's success."
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-blue-400/20"
        >
          <Stat value="2.5K+" label="Active Users" />
          <Stat value="99.8%" label="Uptime" />
          <Stat value="24/7"  label="Support" />
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col justify-between px-8 sm:px-12 lg:px-16 py-12 md:py-16 bg-white"
      >
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
            {/* mobile logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Activity size={14} className="text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900 tracking-wide">MR Reporting</span>
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-2 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Welcome back!
            </h1>
            <p className="text-sm text-gray-400 font-light">Sign in to your account and continue optimizing.</p>
          </motion.div>

          {/* ── DEV QUICK ACCESS ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl"
          >
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>
              Dev Mode — Quick Access (Backend Offline)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEV_PANELS.map((panel) => (
                <button
                  key={panel.role}
                  onClick={() => handleDevAccess(panel)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-gradient-to-br ${panel.color} shadow-lg ${panel.shadow} text-white transition-all hover:scale-[1.04] active:scale-[0.98]`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {panel.initial}
                  </div>
                  <span className="text-[11px] font-semibold leading-tight text-center">{panel.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[11px] text-gray-400 font-medium">or sign in normally</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200 group-focus-within:text-blue-500" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="username"
                  className={inputBase}
                  required
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200 group-focus-within:text-blue-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className={`${inputBase} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 mt-2 transition-all duration-200 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[.99] shadow-lg shadow-blue-500/25"
              }`}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" />Signing In…</>
              ) : (
                <>Sign In<ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-10 pt-8 border-t border-gray-100"
        >
          <p className="text-[10px] font-semibold text-gray-400 mb-5 uppercase tracking-widest">Need Help?</p>
          <div className="space-y-4">
            <HelpRow icon={Phone} label="Phone" value="+91-98XXXXXX90" href="tel:+919800000090" />
            <HelpRow icon={Mail}  label="Email" value="support@mrreporting.com" href="mailto:support@mrreporting.com" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;