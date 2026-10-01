import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Eye, Sparkles, ArrowRight } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDemo } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0d1117]">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar setSidebarOpen={setSidebarOpen} />

        {isDemo && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-b border-amber-500/25 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong className="font-semibold">Demo Workspace (Read-Only):</strong> You are exploring in preview mode. Adding, editing, and deleting items is disabled to protect demo data.
              </span>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 text-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create Free Account
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-[#0d1117]">
          {children}
        </main>
      </div>

    </div>
  );
}