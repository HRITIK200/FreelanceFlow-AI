import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";




   
export default function DashboardLayout({ children }) {
  
  const [sidebarOpen, setSidebarOpen]
   = useState(false);
  
  return (
  <div className="flex min-h-screen">

    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />

    <div className="flex-1">

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow p-4 flex justify-between items-center">

        <h1 className="font-bold text-xl">
          FreelanceFlow AI
        </h1>

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="text-2xl"
        >
          ☰
        </button>

      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
      </main>

    </div>

  </div>
);
}