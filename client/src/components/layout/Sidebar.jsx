import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Activity,
  BriefcaseBusiness,
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
          w-64
          bg-slate-900
          text-white
          z-50
          flex
          flex-col
          transition-transform
          duration-300

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
                w-12
                h-12
                rounded-xl
                bg-blue-600
                flex
                items-center
                justify-center
              "
            >
              <BriefcaseBusiness
                size={24}
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

                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
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
          <div
            className="
              flex
              items-center
              gap-3
              bg-slate-800
              rounded-xl
              p-3
            "
          >
            <div
              className="
                w-10
                h-10
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
              <p className="font-medium">
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
        </div>
      </aside>
    </>
  );
}