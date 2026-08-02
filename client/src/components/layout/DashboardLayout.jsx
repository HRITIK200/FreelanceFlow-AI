import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

        <main className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-[#0d1117]">
          {children}
        </main>
      </div>

    </div>
  );
}