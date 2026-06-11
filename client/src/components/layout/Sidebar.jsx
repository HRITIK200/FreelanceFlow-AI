import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Activity
} from "lucide-react";

export default function Sidebar({

  sidebarOpen, setSidebarOpen,
  }){

  return (
    <div className={`fixed md:static top-0 left-0 h-full w-72 bg-gradient-to-b
               from-slate-900 to-slate-800 text-white z-50 transition-transform duration-300
           ${
             sidebarOpen
               ? "translate-x-0"
               : "-translate-x-full"
              }
            md:translate-x-0
            `}
      >
      <h1 className="text-2xl font-bold mb-8">
        FreelanceFlow AI
      </h1>

      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard"
           className={({ isActive }) => 
              `block p-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white rounded-xl"
                  : "hover:bg-slate-700"
                  }`}
           onClick={() =>
           setSidebarOpen(false)}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/clients"
           className={({ isActive }) => 
              `block p-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white rounded-xl"
                  : "hover:bg-slate-700"
                  }`}
            onClick={() =>
           setSidebarOpen(false)}>
          <Users size={18} />
          <span>Clients</span>
        </NavLink>

        <NavLink to="/projects"
          className={({ isActive }) => 
              `block p-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white rounded-xl"
                  : "hover:bg-slate-700"
                  }`}
           onClick={() =>
           setSidebarOpen(false)}>
          <FolderKanban size={18} />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/invoices"
           className={({ isActive }) => 
              `block p-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white rounded-xl"
                  : "hover:bg-slate-700"
                  }`}
           onClick={() =>
           setSidebarOpen(false)}>
          <Receipt size={18} />
          <span>Invoices</span>
        </NavLink>

        <NavLink to="/activity"
           className={({ isActive }) => 
              `block p-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white rounded-xl"
                  : "hover:bg-slate-700"
                  }`}
           onClick={() =>
           setSidebarOpen(false)}>
          <Activity size={18} />
          <span>Activity</span>
        </NavLink>
      </nav>
    </div>
  );
}