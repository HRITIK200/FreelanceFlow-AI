import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData);
      login(data.token, data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* ── Top Header & Back to Home Button ─────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 transition shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              FreelanceFlow <span className="text-blue-500">AI</span>
            </span>
          </div>
        </div>

        {/* ── Login Glass Card ──────────────────────────────────────── */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sign in to manage your clients, projects, and PDF invoices.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Footer Switch */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}