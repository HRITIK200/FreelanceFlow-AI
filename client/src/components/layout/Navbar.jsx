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
        
        {showNotifications && (
          <div className="absolute top-16 right-28 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold">
                Notifications
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">

              {activities.length === 0 ? (

                <p className="p-4 text-gray-500">
                  No notifications
                </p>

              ) : (

              activities.slice(0, 5)
                        .map((activity) => (

            <div 
              key={activity.id}
              className="flex gap-3 p-4 border-b border-gray-100 hover:bg-gray-50">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-lg">
                 {getNotificationIcon(
                  activity.details
                 )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </p>
            </div>
          </div>
    
        ))
        )}
      </div>

      <div className="p-3 border-t border-gray-100 text-center">
        <button onClick={() => {
          navigate("/activity");
          setShowNotifications(false);
        }}
        className="text-blue-600 font-medium hover:underline">
          View All Activity
        </button>
      </div>
      </div>
        )}

          <span
            className="
              absolute
              -top-1
              -right-1
              h-4
              w-4
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              flex
              items-center
              justify-center
            "
          >
            {notificationCount > 9
              ? "9+"
              : notificationCount
            }
          </span>
        </button>

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