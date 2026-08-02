import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useEffect, useState } from "react";
import { getActivities } from "../../api/activityApi";

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

  const handleLogout =
    () => {
      logout();
      navigate("/login");
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
        bg-white
        border-b
        border-gray-200
        px-4
        md:px-8
        py-4
        flex
        items-center
        justify-between
        sticky
        top-0
        z-30
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
         className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
          {user?.name?.charAt(0)}
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
            hover:bg-red-100
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </header>
  );
}