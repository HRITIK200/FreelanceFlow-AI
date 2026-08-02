import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getClients } from "../../api/clientApi";
import { getProjects } from "../../api/projectApi";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Activity,
  BriefcaseBusiness,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, shortcut: "D", color: "from-blue-500 to-indigo-500" },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Clients",  path: "/clients",  icon: Users,          shortcut: "C", color: "from-violet-500 to-purple-500" },
      { name: "Projects", path: "/projects", icon: FolderKanban,   shortcut: "P", color: "from-cyan-500 to-blue-500"     },
      { name: "Invoices", path: "/invoices", icon: Receipt,        shortcut: "I", color: "from-emerald-500 to-teal-500"  },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Activity", path: "/activity", icon: Activity,  shortcut: "A", color: "from-amber-500 to-orange-500" },
      { name: "Reports",  path: "/reports",  icon: BarChart3, shortcut: "R", color: "from-pink-500 to-rose-500"    },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Settings", path: "/settings", icon: Settings, shortcut: "S", color: "from-slate-500 to-gray-600" },
      { name: "Profile",  path: "/profile",  icon: UserCircle, shortcut: "U", color: "from-sky-500 to-blue-600"  },
    ],
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [clientCount, setClientCount] = useState(null);
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    getClients().then(d => setClientCount(d?.length ?? 0)).catch(() => {});
    getProjects().then(d => setProjectCount(d?.length ?? 0)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";
  const roleLabel = user?.role === "USER" ? "Freelancer" : user?.role || "Freelancer";

  return (
    <>
      {/* ── Mobile overlay ───────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar shell ────────────────────────────────────── */}
      <aside
        style={{ transition: "width 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s ease" }}
        className={`
          fixed md:static top-0 left-0 h-screen z-50
          flex flex-col overflow-hidden
          bg-[#0b0e1a]
          border-r border-white/[0.06]
          shadow-[4px_0_30px_rgba(0,0,0,0.4)]
          ${collapsed ? "w-[72px]" : "w-72"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ── Gradient mesh background ─────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-10 w-40 h-40 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-4 w-32 h-32 bg-purple-600/6 rounded-full blur-2xl" />
        </div>

        {/* ── Logo header ──────────────────────────────────── */}
        <div className={`relative flex items-center border-b border-white/[0.06] ${collapsed ? "justify-center px-0 py-5" : "gap-3 px-5 py-5"}`}>
          {/* Logo icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>

          {/* Name + badge */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-extrabold text-white tracking-tight leading-none">
                  FreelanceFlow
                </h1>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400">
                  <Sparkles size={7} /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Business Dashboard</p>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden md:flex shrink-0 items-center justify-center
              w-6 h-6 rounded-full
              bg-slate-800 hover:bg-slate-700
              border border-white/10
              text-slate-400 hover:text-white
              transition-all duration-200
              ${collapsed ? "mx-auto mt-1" : "ml-auto"}
            `}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* ── Quick stats strip ────────────────────────────── */}
        {!collapsed && (
          <div className="relative mx-4 mt-4 mb-1 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2 border border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Users size={13} className="text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 leading-none">Clients</p>
                <p className="text-sm font-bold text-white leading-tight">
                  {clientCount ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2 border border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <FolderKanban size={13} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 leading-none">Projects</p>
                <p className="text-sm font-bold text-white leading-tight">
                  {projectCount ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────── */}
        <div className="relative flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-none"
          style={{ scrollbarWidth: "none" }}>
          {navSections.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              {!collapsed && (
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 px-3 mb-1.5">
                  {section.label}
                </p>
              )}

              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={({ isActive }) => `
                        group relative flex items-center gap-3
                        ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                        rounded-xl transition-all duration-200
                        ${isActive
                          ? "bg-gradient-to-r from-blue-600/25 to-indigo-600/15 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active left bar */}
                          {isActive && !collapsed && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
                          )}

                          {/* Icon with glow on active */}
                          <span className={`
                            shrink-0 flex items-center justify-center
                            w-8 h-8 rounded-lg transition-all duration-200
                            ${isActive
                              ? `bg-gradient-to-br ${item.color} shadow-lg text-white`
                              : "bg-white/[0.04] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-white"
                            }
                          `}>
                            <Icon size={16} />
                          </span>

                          {/* Label + shortcut */}
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-[13px] font-semibold">
                                {item.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-600 group-hover:text-slate-400 transition-colors">
                                {item.shortcut}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Section divider */}
              {!collapsed && <div className="mt-3 border-t border-white/[0.04]" />}
            </div>
          ))}
        </div>

        {/* ── Footer / User card ───────────────────────────── */}
        <div className="relative border-t border-white/[0.06] p-3">
          {collapsed ? (
            /* Mini avatar only */
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {avatarLetter}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0e1a]" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            /* Full user card */
            <div>
              {/* Pro upgrade nudge */}
              <div className="mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-600/15 to-indigo-600/10 border border-blue-500/20 rounded-xl px-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                  <Zap size={13} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white leading-none">FreelanceFlow AI</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">v1.0 · All features active</p>
                </div>
                <TrendingUp size={14} className="text-blue-400 shrink-0" />
              </div>

              {/* User info row */}
              <div className="flex items-center gap-2.5 bg-white/[0.04] rounded-xl p-2.5 border border-white/[0.06]">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                    {avatarLetter}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0e1a]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white truncate leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{roleLabel}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}