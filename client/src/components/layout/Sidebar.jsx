import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">
        FreelanceFlow AI
      </h1>

      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/clients">
          Clients
        </NavLink>

        <NavLink to="/projects">
          Projects
        </NavLink>

        <NavLink to="/invoices">
          Invoices
        </NavLink>

        <NavLink to="/activity">
          Activity
        </NavLink>
      </nav>
    </div>
  );
}