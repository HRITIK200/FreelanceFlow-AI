import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useEffect, useState } from "react";
import { getActivities } from "../../api/activityApi";
import { getClients } from "../../api/clientApi";

import GlobalSearch
from "../search/GlobalSearch";

import {
  Bell,
  Menu,
  LogOut,
} from "lucide-react";

export default function Navbar({
  setSidebarOpen,
}) {
  const { logout,user } = useAuth();

  const navigate =
    useNavigate();

  const [notificationCount,
  setNotificationCount] =
  useState(0);

  const [activities, setActivities] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("ff_theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(() => localStorage.getItem("ff_active_client_filter") || "all");

  const handleLogout =
    () => {
      logout();
      navigate("/login");
    };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ff_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ff_theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const list = await getClients();
        setClients(list);
      } catch (e) {
        console.log(e);
      }
    };
    loadClients();
  }, []);

  const handleClientFilterChange = (clientId) => {
    setActiveClient(clientId);
    localStorage.setItem("ff_active_client_filter", clientId);
    window.dispatchEvent(new Event("clientFilterChanged"));
  };

  useEffect(() => {

  const fetchNotifications =
    async () => {

      try {

        const data = await getActivities();

        setActivities(data);

        setNotificationCount(
          Math.min(
            data.length,9
          )
        );
        

      } catch (error) {

        console.log(error);

      }
    };

    fetchNotifications();
     
   }, []);

  const getNotificationIcon = (text) => {

  const message =
    text.toLowerCase();

  if (
    message.includes("client")
  ) {
    return "👤";
  }

  if (
    message.includes("project")
  ) {
    return "📁";
  }

  if (
    message.includes("invoice")
  ) {
    return "🧾";
  }

  if (
    message.includes("email")
  ) {
    return "✉️";
  }

  return "🔔";
};

  return (
    <header
      className="
        bg-white/85
        backdrop-blur-md
        border-b
        border-white/20
        px-4
        md:px-8
        py-4
        flex
        items-center
        justify-between
        sticky
        top-0
        z-30
        shadow-[0_2px_20px_rgba(0,0,0,0.015)]
      "
    >
      {/* Left Side */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
            md:hidden
            p-2
            rounded-lg
            hover:bg-gray-100
          "
        >
          <Menu size={22} />
        </button>

        {/* Search */}

      <div className="hidden sm:block">
        <GlobalSearch />
      </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-4 relative">

        {/* Client Switcher Dropdown */}
        <div className="relative hidden lg:block">
          <select
            value={activeClient}
            onChange={(e) => handleClientFilterChange(e.target.value)}
            className="bg-slate-100/80 hover:bg-slate-100 text-xs font-bold text-gray-600 rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-blue-500/20 transition cursor-pointer appearance-none pr-8 shadow-sm"
          >
            <option value="all">📁 All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.company || c.name}>
                👤 {c.company || c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-[8px]">
            ▼
          </div>
        </div>

        {/* Theme Switcher Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-gray-500 transition shadow-sm text-sm"
          title="Toggle light/dark theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notification */}
        <div className="relative">
          <button 
             onClick={() =>
               setShowNotifications(!showNotifications)
             }
           className="
              relative
              p-2
              rounded-xl
              hover:bg-gray-100
            "
          >
            <Bell size={20} />
          
            {notificationCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping opacity-75" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">
                  Recent Notifications
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  {notificationCount} Alerts
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-400 italic">
                    No notifications yet
                  </p>
                ) : (
                  activities.slice(0, 5).map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex gap-3 p-4 border-b border-gray-50 hover:bg-blue-50/30 transition-all duration-200"
                    >
                      <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-lg shadow-sm">
                         {getNotificationIcon(activity.details)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700 leading-normal">
                          {activity.details}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">
                          {new Date(activity.createdAt).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-gray-100 text-center bg-gray-50/30">
                <button 
                  onClick={() => {
                    navigate("/activity");
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}

        <div
          className="
            hidden
            md:flex
            flex-col
            text-right
          "
        >
          <p className="font-semibold">
            {user?.name}
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {user?.role === "USER"
               ? "Freelancer"
               : user?.role}
          </p>
        </div>

        <button onClick={() =>
           navigate("/profile")
         }
         className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-blue-500/20">
          {user?.name?.charAt(0)?.toUpperCase()}
         </button>
        

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="
            hidden
            md:flex
            items-center
            gap-2
            px-4
            py-2
            rounded-xl
            bg-red-50
            text-red-600
            hover:bg-red-500
            hover:text-white
            hover:shadow-md
            hover:shadow-red-500/10
            text-xs
            font-bold
            transition-all
            duration-300
          "
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
}