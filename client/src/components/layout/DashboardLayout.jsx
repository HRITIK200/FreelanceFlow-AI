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
            p-4
            md:p-6
            lg:p-8
            bg-gradient-to-br
            from-slate-50
            via-blue-50
            to-indigo-50
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}