import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";

import {
  User,
  Shield,
  Bell,
  AlertTriangle,
  Palette,
  CreditCard,
  CheckCircle2,
  Lock,
  Mail,
  Building2,
  Phone,
  Briefcase,
  Globe,
  Save,
  KeyRound,
  Laptop,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
  DollarSign,
  ShieldAlert,
  Sliders,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const isDemo = user?.role === "DEMO";

  // Tab State
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [name, setName] = useState(() => localStorage.getItem("freelancer_name") || user?.name || "Freelancer User");
  const [email, setEmail] = useState(() => localStorage.getItem("freelancer_email") || user?.email || "freelancer@example.com");
  const [title, setTitle] = useState(() => localStorage.getItem("freelancer_title") || "Senior Full-Stack Freelancer");
  const [company, setCompany] = useState(() => localStorage.getItem("freelancer_company") || "FlowStudio Agency");
  const [phone, setPhone] = useState(() => localStorage.getItem("freelancer_phone") || "+91 98765 43210");
  const [bio, setBio] = useState(
    () => localStorage.getItem("freelancer_bio") || "Building high-performance web applications and design systems for global clients."
  );

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem("freelancer_2fa") === "true");

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("freelancer_notifications");
    return saved ? JSON.parse(saved) : {
      emailAlerts: true,
      invoiceReminders: true,
      projectDeadlines: true,
      weeklyDigest: false,
      marketingEmails: false,
    };
  });

  // Preferences State
  const [currency, setCurrency] = useState(() => localStorage.getItem("freelancer_currency") || "INR (₹)");
  const [hourlyRate, setHourlyRate] = useState(() => localStorage.getItem("freelancer_hourly_rate") || "2500");
  const [taxRate, setTaxRate] = useState(() => localStorage.getItem("freelancer_tax_rate") || "18");
  const [paymentTerms, setPaymentTerms] = useState(() => localStorage.getItem("freelancer_payment_terms") || "14");

  // App Preferences
  const [timezone, setTimezone] = useState(() => localStorage.getItem("freelancer_timezone") || "(GMT+05:30) Asia/Kolkata (IST)");
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem("freelancer_date_format") || "DD/MM/YYYY (e.g. 03/08/2026)");

  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (isDemo) {
      toast.error("Demo user credentials cannot be modified");
      return;
    }
    setSavingProfile(true);

    localStorage.setItem("freelancer_name", name);
    localStorage.setItem("freelancer_email", email);
    localStorage.setItem("freelancer_title", title);
    localStorage.setItem("freelancer_company", company);
    localStorage.setItem("freelancer_phone", phone);
    localStorage.setItem("freelancer_bio", bio);

    window.dispatchEvent(new Event("userSettingsChanged"));

    setTimeout(() => {
      setSavingProfile(false);
      toast.success("Profile preferences saved successfully! ✨");
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (isDemo) {
      toast.error("Demo user credentials cannot be modified");
      return;
    }
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingSecurity(true);
    setTimeout(() => {
      setSavingSecurity(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security settings updated successfully! 🔒");
    }, 400);
  };

  const handleDeleteAccount = () => {
    if (isDemo) {
      toast.error("Demo accounts cannot be deleted");
      setIsDeleteOpen(false);
      return;
    }
    toast.success("Account deletion request logged.");
    setIsDeleteOpen(false);
  };

  const tabs = [
    { id: "profile", label: "Profile & Info", icon: User },
    { id: "security", label: "Security & Auth", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing & Rates", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* ── Page Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <User size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Manage your personal profile, security credentials, and application preferences
            </p>
          </div>

          {isDemo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <ShieldAlert size={14} /> Demo Mode (Read-Only)
            </div>
          )}
        </div>

        {/* ── User Banner Card ──────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-extrabold shadow-lg shrink-0">
              {name?.charAt(0)?.toUpperCase() || "F"}
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold truncate">{name}</h2>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm self-center sm:self-auto">
                  <Sparkles size={12} className="mr-1" /> {user?.role || "Freelancer"}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-0.5 truncate">{email}</p>
              <p className="text-xs text-blue-200/80 mt-2 flex items-center justify-center sm:justify-start gap-1">
                <Globe size={12} /> {company} • {title}
              </p>
            </div>
          </div>
        </div>

        {/* ── Settings Layout: Tab Sidebar + Content ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-1 bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-2 shadow-sm self-start">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === "danger";

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? isDanger
                        ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                        : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : isDanger
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      : "text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* ── Profile & Info Tab ─────────────────────────── */}
            {activeTab === "profile" && (
              <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                  <User size={20} className="text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Professional Title
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Business / Agency Name
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Bio / Tagline
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all duration-200 disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {savingProfile ? "Saving..." : "Save Profile Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Security & Auth Tab ────────────────────────── */}
            {activeTab === "security" && (
              <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                  <Shield size={20} className="text-indigo-500" />
                  <h3 className="text-lg font-bold text-gray-900">Security Credentials</h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingSecurity}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all duration-200 disabled:opacity-60"
                    >
                      {savingSecurity ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Shield size={16} />
                      )}
                      {savingSecurity ? "Updating..." : "Update Security Password"}
                    </button>
                  </div>
                </form>

                {/* 2FA Section */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security using an authenticator app</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = !twoFactor;
                      setTwoFactor(next);
                      localStorage.setItem("freelancer_2fa", String(next));
                      toast.success(`2FA ${next ? "Enabled" : "Disabled"}`);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFactor ? "bg-indigo-600" : "bg-gray-200 dark:bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactor ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/[0.06] space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
                      <div className="flex items-center gap-3">
                        <Laptop size={18} className="text-indigo-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">Chrome on Windows (Current Session)</p>
                          <p className="text-[10px] text-gray-400">Mumbai, India • Active Now</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Online
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-gray-400" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">Safari on iPhone 15 Pro</p>
                          <p className="text-[10px] text-gray-400">Delhi, India • 2 hours ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success("Session revoked")}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Notifications Tab ─────────────────────────── */}
            {activeTab === "notifications" && (
              <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                  <Bell size={20} className="text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailAlerts",
                      title: "Email System Alerts",
                      desc: "Receive instant emails when crucial system events or errors occur",
                    },
                    {
                      key: "invoiceReminders",
                      title: "Invoice & Payment Reminders",
                      desc: "Get notified when an invoice becomes overdue or payment is received",
                    },
                    {
                      key: "projectDeadlines",
                      title: "Project Milestone Warnings",
                      desc: "Receive warnings 3 days prior to project deadline expiration",
                    },
                    {
                      key: "weeklyDigest",
                      title: "Weekly Business Performance Digest",
                      desc: "Receive a Monday morning breakdown of revenue and activity stats",
                    },
                    {
                      key: "marketingEmails",
                      title: "Feature Updates & Product Tips",
                      desc: "Occasional news about new features and product enhancements",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => {
                          const updated = { ...notifications, [item.key]: e.target.checked };
                          setNotifications(updated);
                          localStorage.setItem("freelancer_notifications", JSON.stringify(updated));
                          toast.success("Preferences updated");
                        }}
                        className="h-5 w-5 rounded accent-blue-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Billing & Rates Tab ────────────────────────── */}
            {activeTab === "billing" && (
              <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                  <CreditCard size={20} className="text-emerald-500" />
                  <h3 className="text-lg font-bold text-gray-900">Billing & Rate Configurations</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Default Hourly Rate
                    </label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Standard Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Preferred Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Invoice Due Terms (Days)
                    </label>
                    <input
                      type="number"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("freelancer_hourly_rate", hourlyRate);
                    localStorage.setItem("freelancer_tax_rate", taxRate);
                    localStorage.setItem("freelancer_currency", currency);
                    localStorage.setItem("freelancer_payment_terms", paymentTerms);
                    window.dispatchEvent(new Event("userSettingsChanged"));
                    toast.success("Billing preferences saved!");
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-500/25 transition-all duration-200"
                >
                  <CheckCircle2 size={16} /> Save Billing Terms
                </button>
              </div>
            )}

            {/* ── Preferences Tab ────────────────────────────── */}
            {activeTab === "preferences" && (
              <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-4">
                  <Palette size={20} className="text-purple-500" />
                  <h3 className="text-lg font-bold text-gray-900">Application Preferences</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      <option>(GMT+05:30) Asia/Kolkata (IST)</option>
                      <option>(GMT+00:00) UTC / London</option>
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      <option>DD/MM/YYYY (e.g. 03/08/2026)</option>
                      <option>MM/DD/YYYY (e.g. 08/03/2026)</option>
                      <option>YYYY-MM-DD (e.g. 2026-08-03)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("freelancer_timezone", timezone);
                    localStorage.setItem("freelancer_date_format", dateFormat);
                    window.dispatchEvent(new Event("userSettingsChanged"));
                    toast.success("System preferences saved!");
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-500/25 transition-all duration-200"
                >
                  <Save size={16} /> Save Preferences
                </button>
              </div>
            )}

            {/* ── Danger Zone Tab ───────────────────────────── */}
            {activeTab === "danger" && (
              <div className="bg-red-50/50 dark:bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-200 dark:border-red-500/20 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-red-200 dark:border-red-500/20 pb-4">
                  <AlertTriangle size={20} className="text-red-500" />
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#161b28] border border-red-100 dark:border-red-500/10">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Export All Personal Data</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Download a JSON copy of your projects, clients, and invoice history</p>
                    </div>
                    <button
                      onClick={() => toast.success("Data export initiated")}
                      className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      Export JSON
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#161b28] border border-red-100 dark:border-red-500/10">
                    <div>
                      <h4 className="font-bold text-red-600 dark:text-red-400 text-sm">Delete Account & Data</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and all associated workspace records</p>
                    </div>
                    <button
                      onClick={() => setIsDeleteOpen(true)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Account Permanently"
        message="Are you sure you want to permanently delete your FreelanceFlow account? This action is irreversible."
        onConfirm={handleDeleteAccount}
      />
    </DashboardLayout>
  );
}