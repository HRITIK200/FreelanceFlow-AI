import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Zap,
  ShieldCheck,
  FileText,
  BarChart3,
  Users,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Download,
  IndianRupee,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("ff_theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ff_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ff_theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      {/* ── Top Navigation Bar ───────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              FreelanceFlow <span className="text-blue-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#tech-stack" className="hover:text-white transition">Tech Stack</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shadow-sm"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition"
                >
                  Get Started Free <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-blue-400 text-xs font-bold tracking-wide uppercase mb-8 shadow-inner">
            <Sparkles size={14} className="animate-pulse" /> AI-Powered Freelance Management SaaS
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6">
            Manage Clients, Projects & Automate PDF Invoices in{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              One Flow.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
            The all-in-one freelance operating system for modern developers, designers, and agencies.
            Track clients, monitor project progress, stream single-page PDF invoices, and analyze business health in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-base transition shadow-md"
            >
              Sign In to Account
            </button>
          </div>

          {/* ── Mockup Glass Card Preview ─────────────────────────────── */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl border border-slate-800/80 max-w-4xl mx-auto">
            <div className="bg-slate-950/90 rounded-[22px] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-500 ml-2">app.freelanceflow.ai/dashboard</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  ● Live Analytics Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left mb-6">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase">Clients</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">12</h3>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase">Active Projects</p>
                  <h3 className="text-2xl font-extrabold text-blue-400 mt-1">18</h3>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase">Paid Revenue</p>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">₹3,85,000</h3>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase">Collection Rate</p>
                  <h3 className="text-2xl font-extrabold text-purple-400 mt-1">94%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Features Section ────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-slate-900/40 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Everything You Need to Run Your Freelance Business
            </h2>
            <p className="text-slate-400 font-medium">
              Engineered with clean code practices, row-level data isolation, and memory-efficient streaming.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Client Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Maintain organized client profiles, assign contacts, link active project pipelines, and view client-specific revenue rankings.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <FolderKanban size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track project milestones with interactive progress bars (0-100%), manage deadline dates, and sync project statuses in real time.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">In-Memory PDF Invoices</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stream dynamic single-page PDF invoices straight to browser downloads using PDFKit memory piping without server disk overhead.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics & Excel Export</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize monthly revenue trends with Recharts and export comprehensive business executive summaries to Microsoft Excel (.xlsx).
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-amber-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">JWT & Row-Level Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stateless JWT authentication, Zod input validation schemas, Helmet headers, and PostgreSQL row-level multi-tenant user data privacy.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-rose-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Event Bus</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Custom browser event bus synchronizes profile avatar changes and global client header filtering instantly without full page reloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Section ───────────────────────────────────────── */}
      <section id="tech-stack" className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Powered by Production-Grade Technologies
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["React 18", "Node.js", "Express.js", "PostgreSQL", "Prisma ORM", "PDFKit", "Zod", "Tailwind CSS", "Recharts", "SheetJS"].map((tech) => (
              <span key={tech} className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-slate-800/60 bg-slate-950 text-center text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-300">FreelanceFlow AI</span> © {new Date().getFullYear()}
          </div>
          <p className="text-xs text-slate-500">
            Designed & Engineered with PERN Stack (PostgreSQL, Express, React, Node.js)
          </p>
        </div>
      </footer>
    </div>
  );
}
