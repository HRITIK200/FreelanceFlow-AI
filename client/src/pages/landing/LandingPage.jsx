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
  Moon,
  Sun,
  ChevronDown,
  PlayCircle,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import toast from "react-hot-toast";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("ff_theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ff_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ff_theme", "light");
    }
  }, [darkMode]);

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      const demoData = {
        email: "demo@freelanceflow.ai",
        password: "demopassword",
      };
      const data = await loginUser(demoData);
      login(data.token, data.user);
      toast.success("Welcome! Demo account logged in.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Demo login failed. Navigating to login page.");
      navigate("/login");
    } finally {
      setDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: "What is FreelanceFlow AI?",
      a: "FreelanceFlow AI is an all-in-one freelance management SaaS that unifies client records, project milestone progress, PDF invoice streaming, and real-time revenue analytics into a single dashboard.",
    },
    {
      q: "How does the PDF Invoice Generator work?",
      a: "Our PDF engine uses memory streaming to pipe single-page PDF invoices directly into browser HTTP responses. No files are stored on disk, delivering instant downloads with zero server overhead.",
    },
    {
      q: "Is my business data secure?",
      a: "Yes. FreelanceFlow AI implements stateless JWT authentication, input validation schemas, security headers, rate limiting, and row-level multi-tenant user data privacy.",
    },
    {
      q: "Can I export my financial data to Excel?",
      a: "Absolutely! With one click on 'Export Executive Summary', your client revenues, project completion stats, and collection rates export directly into a Microsoft Excel (.xlsx) file.",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white transition-colors duration-300`}>
      <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
        
        {/* ── Top Navigation Bar ───────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                FreelanceFlow <span className="text-blue-600 dark:text-blue-500">AI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition">Features</a>
              <a href="#demo" className="hover:text-blue-600 dark:hover:text-white transition">Live Preview</a>
              <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-800 transition shadow-sm active:scale-95 cursor-pointer"
                title="Toggle Light/Dark Theme"
              >
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
              </button>

              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
                >
                  Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition active:scale-95"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero Section ────────────────────────────────────────────── */}
        <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide uppercase mb-8 shadow-sm">
              <Sparkles size={14} className="animate-pulse text-blue-600 dark:text-blue-400" /> Streamline Clients, Projects & Invoices in Real-Time
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] mb-6 text-slate-900 dark:text-white">
              The Modern OS for Freelancers &{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                Agencies.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              Manage clients, track project completion milestones, stream single-page PDF invoices, and monitor revenue growth with industrial security and zero crash bottlenecks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                Start Free Account <ArrowRight size={18} />
              </button>

              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 font-bold text-base transition active:scale-95 cursor-pointer shadow-sm"
              >
                <PlayCircle size={18} className="text-blue-600 dark:text-blue-400" /> {demoLoading ? "Logging into Demo..." : "Instant Demo Account"}
              </button>
            </div>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold mb-16">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> 100% In-Memory PDF Streaming
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> Row-Level Multi-Tenant Isolation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> Automated Excel (.xlsx) Exports
              </div>
            </div>

            {/* ── Interactive Live Preview Mockup Card ─────────────────────── */}
            <div id="demo" className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-slate-200 dark:to-slate-800 shadow-2xl border border-slate-300 dark:border-slate-800 max-w-4xl mx-auto">
              <div className="bg-white/95 dark:bg-slate-950/90 rounded-[22px] p-5 sm:p-8 backdrop-blur-xl text-left border border-slate-200/80 dark:border-slate-800/80">
                {/* Mockup Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">app.freelanceflow.ai/dashboard</span>
                  </div>

                  {/* Mockup Tabs */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab("invoices")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "invoices" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      PDF Invoices
                    </button>
                    <button
                      onClick={() => setActiveTab("reports")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "reports" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      Analytics
                    </button>
                  </div>
                </div>

                {/* Tab 1: Dashboard Mockup */}
                {activeTab === "dashboard" && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Clients</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">12</h3>
                      </div>
                      <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Active Projects</p>
                        <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">18</h3>
                      </div>
                      <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Paid Revenue</p>
                        <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹3,85,000</h3>
                      </div>
                      <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Success Rate</p>
                        <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">94%</h3>
                      </div>
                    </div>

                    <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          💼
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">Stark Industries Redesign</p>
                          <p className="text-xs text-slate-500">Client: Tony Stark • Progress: 85%</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        IN_PROGRESS
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Invoices Mockup */}
                {activeTab === "invoices" && (
                  <div className="space-y-3">
                    <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">INV-2026-001 • Batcave AI Upgrade</p>
                        <p className="text-xs text-slate-500">Billed to: Bruce Wayne • Amount: INR 1,25,000</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          PAID
                        </span>
                        <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Download size={14} /> Stream PDF
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-100/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">INV-2026-002 • Oscorp Cloud Portal</p>
                        <p className="text-xs text-slate-500">Billed to: Norman Osborn • Amount: INR 85,000</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                          PENDING
                        </span>
                        <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Download size={14} /> Stream PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Reports Mockup */}
                {activeTab === "reports" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Collection Efficiency</p>
                        <h4 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">92% Collected</h4>
                      </div>
                      <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm">
                        <Download size={14} /> Export to Excel (.xlsx)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Features Grid ────────────────────────────────────────── */}
        <section id="features" className="py-20 px-4 sm:px-6 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/60 transition-colors">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                Everything You Need to Scale Your Freelance Business
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Engineered with production security, row-level data isolation, and non-blocking background architecture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Client Directory</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Organize clients, store contact details, map budgets, and track client-specific earnings rankings.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <FolderKanban size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Project Progress Sliders</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Interactive progress percentage sliders (0-100%), pre-synced status updates, and deadline reminders.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">In-Memory PDF Invoices</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Stream PDF invoices directly into HTTP responses using PDFKit memory buffers without server file overhead.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analytics & Excel Exports</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Recharts analytics for revenue trends and 1-click SheetJS (.xlsx) executive summary data exports.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">JWT & Row Isolation</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Stateless JWT tokens, Zod schema validation, Helmet headers, and multi-tenant row-level access control.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500/30 transition group">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Real-Time Event Bus</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Browser event bus synchronizes profile avatars and client header filtering instantly without page reloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────────── */}
        <section id="faq" className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Everything you need to know about FreelanceFlow AI features and architecture.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-base text-slate-900 dark:text-white">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom Call To Action Banner ────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Ready to Streamline Your Freelance Business?
              </h2>
              <p className="text-blue-100 text-base sm:text-lg mb-8 font-medium">
                Join freelancers managing clients, projects, and invoices with 100% data security.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-base shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Create Free Account <ArrowRight size={18} className="inline ml-1" />
                </button>
                <button
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition active:scale-95 cursor-pointer"
                >
                  {demoLoading ? "Logging in..." : "Instant Demo Login"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 text-center text-slate-500 text-sm transition-colors">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-500" />
              <span className="font-bold text-slate-800 dark:text-slate-300">FreelanceFlow AI</span> © {new Date().getFullYear()}
            </div>
            <p className="text-xs text-slate-500">
              Designed & Built for Freelancers & Boutiques
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
