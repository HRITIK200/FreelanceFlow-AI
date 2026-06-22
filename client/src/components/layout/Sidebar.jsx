import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";



import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Activity,
  BriefcaseBusiness,
  Settings,
  BarChart3,
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      path: "/clients",
      icon: Users,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: Receipt,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: Activity,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    }

  ];

  return (
    <>
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            md:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`
          fixed
          md:static
          top-0
          left-0
          h-screen
          w-72
          bg-slate-900
          text-white
          z-50
          flex
          flex-col
          overflow-hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Logo */}

        <div
          className="
            px-6
            py-6
            border-b
            border-slate-800
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-14
                h-14
                rounded-xl
                bg-blue-600
                flex
                items-center
                justify-center
              "
            >
              <BriefcaseBusiness
                size={28}
              />
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                "
              >
                FreelanceFlow
              </h1>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Business Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4
            py-6
          "
        >
          <p
            className="
              text-xs
              uppercase
              text-slate-500
              tracking-wider
              mb-4
            "
          >
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(
                        false
                      )
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      transition-all
                      duration-300
                      hover:translate-x-1

                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `
                    }
                  >
                    <Icon
                      size={20}
                    />

                    <span
                      className="
                        font-medium
                      "
                    >
                      {item.name}
                    </span>
                  </NavLink>
                );
              }
            )}
          </nav>
        </div>

        


        {/* Footer */}

        <div
          className="
            p-4
            border-t
            border-slate-800
          "
        >
        <div className="text-center mb-4">
          <span className="text-center text-xs text-slate-500 mb-3">
            FreelanceFlow AI v1.0
          </span>
        </div>

          <div
            className="
              flex
              items-center
              gap-3
              bg-slate-800
              rounded-2xl
              p-4
              shadow-lg
              hover:bg-slate-700
              trasition
            "
          >
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="font-semibold text-white">
                {user?.name || "User"}
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                {user?.role === "USER"
                  ? "Freelancer"
                  : user?.role || "Freelancer"}
              </p>
            </div>
          </div>

        <div className="mt-4 border-t border-slate-700 pt-4">

          <NavLink to="/profile" 
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                  👤My Profile
                </NavLink>
   
        </div>

        <p className="text-xs text-slate-500 mt-4">
           © {new Date().getFullYear()} FreelanceFlow
        </p>

      </div>
      </aside>
    </>
  );
}