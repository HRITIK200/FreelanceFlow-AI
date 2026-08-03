import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { getDashboardStats } from "../../api/dashboardApi";
import { Link } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-hot-toast";

import {
  User,
  Mail,
  Shield,
  IndianRupee,
  Users,
  FolderKanban,
  Receipt,
  Award,
  Star,
  CheckCircle2,
  Settings as SettingsIcon,
  Sparkles,
  Calendar,
  Briefcase,
  Share2,
  TrendingUp,
  Plus,
  X,
  Target,
  Zap,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Dynamic user details
  const [profileName, setProfileName] = useState(() => localStorage.getItem("freelancer_name") || user?.name || "Freelancer User");
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem("freelancer_email") || user?.email || "freelancer@example.com");
  const [profileTitle, setProfileTitle] = useState(() => localStorage.getItem("freelancer_title") || "Senior Full-Stack Freelancer");
  const [profileCompany, setProfileCompany] = useState(() => localStorage.getItem("freelancer_company") || "FlowStudio Agency");

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalInvoices: 0,
    paidRevenue: 0,
  });

  // Dynamic skills
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem("freelancer_skills");
    return saved ? JSON.parse(saved) : [
      "React.js",
      "Node.js",
      "TypeScript",
      "TailwindCSS",
      "Next.js",
      "UI/UX Design",
      "PostgreSQL",
      "REST & GraphQL",
    ];
  });
  const [newSkill, setNewSkill] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Dynamic availability
  const [availability, setAvailability] = useState(() => localStorage.getItem("freelancer_availability") || "Available for Work");

  const syncSettings = () => {
    setProfileName(localStorage.getItem("freelancer_name") || user?.name || "Freelancer User");
    setProfileEmail(localStorage.getItem("freelancer_email") || user?.email || "freelancer@example.com");
    setProfileTitle(localStorage.getItem("freelancer_title") || "Senior Full-Stack Freelancer");
    setProfileCompany(localStorage.getItem("freelancer_company") || "FlowStudio Agency");
  };

  useEffect(() => {
    syncSettings();
    window.addEventListener("userSettingsChanged", syncSettings);
    return () => window.removeEventListener("userSettingsChanged", syncSettings);
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data || {});
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error("Skill already added");
      return;
    }
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    localStorage.setItem("freelancer_skills", JSON.stringify(updated));
    setNewSkill("");
    setShowAddSkill(false);
    toast.success("Skill tag added! ⚡");
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem("freelancer_skills", JSON.stringify(updated));
    toast.success("Skill removed");
  };

  const handleToggleAvailability = () => {
    const options = ["Available for Work", "In a Sprint", "Busy / Fully Booked"];
    const currentIdx = options.indexOf(availability);
    const nextOption = options[(currentIdx + 1) % options.length];
    setAvailability(nextOption);
    localStorage.setItem("freelancer_availability", nextOption);
    toast.success(`Status updated: "${nextOption}"`);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard! 📋");
    } else {
      toast.success("Profile link ready to share!");
    }
  };

  // Dynamic computations
  const avgDealSize = useMemo(() => {
    if (!stats.totalProjects) return 0;
    return Math.round((stats.paidRevenue || 0) / stats.totalProjects);
  }, [stats]);

  const profileStrength = useMemo(() => {
    let score = 50;
    if (profileName) score += 10;
    if (profileTitle) score += 10;
    if (profileCompany) score += 10;
    if (skills.length >= 5) score += 10;
    if (stats.totalProjects > 0) score += 10;
    return Math.min(score, 100);
  }, [profileName, profileTitle, profileCompany, skills, stats]);

  const memberSinceYear = useMemo(() => {
    if (user?.createdAt) return new Date(user.createdAt).getFullYear();
    return 2026;
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* ── Page Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <User size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Freelancer Profile
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Your public professional summary, business statistics, and verified skills
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-500/10 text-sm font-semibold transition-all duration-200"
            >
              <Share2 size={15} />
              Share Profile
            </button>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all duration-200"
            >
              <SettingsIcon size={15} />
              Edit Profile Settings
            </Link>
          </div>
        </div>

        {/* ── Hero Profile Banner ────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -mb-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Left Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-extrabold shadow-xl border-2 border-white/20">
                  {profileName?.charAt(0)?.toUpperCase() || "F"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-3xl font-extrabold tracking-tight">{profileName}</h2>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                    <Sparkles size={12} className="mr-1 text-amber-300" /> Pro Freelancer
                  </span>
                </div>

                <p className="text-slate-300 text-sm flex items-center justify-center sm:justify-start gap-1">
                  <Mail size={14} className="text-indigo-400" /> {profileEmail}
                </p>

                <p className="text-xs text-indigo-200/80 font-medium">{profileTitle} • {profileCompany}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleToggleAvailability}
                    title="Click to cycle status"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {availability}
                  </button>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" /> Member since {memberSinceYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Rating / Completion Widget */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center md:text-right space-y-1 min-w-[150px]">
                <div className="flex items-center justify-center md:justify-end gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-white text-xs font-bold ml-1">5.0</span>
                </div>
                <p className="text-[11px] text-slate-300">Client Rating (100% Positive)</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-4 text-center md:text-right">
                <p className="text-[11px] text-slate-300">Profile Strength</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${profileStrength}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{profileStrength}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Metrics Grid (4 Stat Cards) ────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Active Clients",
              value: stats.totalClients,
              icon: Users,
              bg: "bg-blue-500/10",
              text: "text-blue-400",
              accent: "from-blue-500 to-indigo-600",
              sub: "Connected organizations",
            },
            {
              label: "Total Projects",
              value: stats.totalProjects,
              icon: FolderKanban,
              bg: "bg-purple-500/10",
              text: "text-purple-400",
              accent: "from-purple-500 to-pink-600",
              sub: "Completed & ongoing",
            },
            {
              label: "Invoices Issued",
              value: stats.totalInvoices,
              icon: Receipt,
              bg: "bg-amber-500/10",
              text: "text-amber-400",
              accent: "from-amber-500 to-orange-600",
              sub: "Total billing cycles",
            },
            {
              label: "Total Revenue",
              value: `₹${(stats.paidRevenue || 0).toLocaleString()}`,
              icon: IndianRupee,
              bg: "bg-emerald-500/10",
              text: "text-emerald-400",
              accent: "from-emerald-500 to-teal-600",
              sub: "Collected payments",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}
                  >
                    <Icon size={17} className={s.text} />
                  </div>
                  <Zap size={13} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">
                  {loading ? <Skeleton className="h-6 w-16" /> : s.value}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Main 2-Column Section ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Details & Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details Card */}
            <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-indigo-500" />
                  <h3 className="text-lg font-bold text-gray-900">Account Credentials</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-500/20">
                  Verified Freelancer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <User size={14} /> Full Name
                  </div>
                  <p className="font-bold text-gray-900 text-sm truncate">{profileName}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <Mail size={14} /> Email Address
                  </div>
                  <p className="font-bold text-gray-900 text-sm truncate">{profileEmail}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <Shield size={14} /> System Role
                  </div>
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {user?.role || "Freelancer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Analytics Card */}
            <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-500" />
                  <h3 className="text-lg font-bold text-gray-900">Business Highlights</h3>
                </div>
                <span className="text-xs text-gray-400 font-medium">Real-time statistics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-100 dark:border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    ₹{(stats.paidRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">100% verified payments</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-100 dark:border-blue-500/20">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Avg Deal Size
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    ₹{avgDealSize.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">per project record</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-100 dark:border-purple-500/20">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    On-Time Delivery
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">98.5%</p>
                  <p className="text-[11px] text-gray-500 mt-1">High client trust score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Skills & Badges */}
          <div className="space-y-6">
            {/* Verified Skills Card */}
            <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-purple-500" />
                  <h3 className="text-lg font-bold text-gray-900">Skills & Tech Stack</h3>
                </div>
                <button
                  onClick={() => setShowAddSkill(!showAddSkill)}
                  className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                  title="Add Skill Tag"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add Skill Form */}
              {showAddSkill && (
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GraphQL, Vue.js..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 text-xs font-semibold hover:border-purple-300 transition-all border border-gray-200/60 dark:border-white/[0.06] group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Platform Badges */}
            <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                <Target size={20} className="text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900">Platform Badges</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/15">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Star size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Top Rated Freelancer</p>
                    <p className="text-[11px] text-gray-500">Top 5% performer in workspace</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/15">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Identity Verified</p>
                    <p className="text-[11px] text-gray-500">Government ID & Email confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}