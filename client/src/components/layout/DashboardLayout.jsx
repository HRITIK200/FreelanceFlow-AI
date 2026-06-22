import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}) {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">

        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className="
            flex-1
            p-6
            md:p-8
            bg-slate-50
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}