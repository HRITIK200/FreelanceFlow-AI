import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useEffect, useState } from "react";
import { getActivities } from "../../api/activityApi";

import GlobalSearch
from "../search/GlobalSearch";

import {
  Bell,
  Search,
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


  const handleLogout =
    () => {
      logout();
      navigate("/login");
    };

  useEffect(() => {

  const fetchNotifications =
    async () => {

      try {

        const activities =
          await getActivities();

        setNotificationCount(
          Math.min(
          activities.length,9)
        );
        

      } catch (error) {

        console.log(error);

      }
    };

    fetchNotifications();
     
   }, []);

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

      <div className="flex items-center gap-4">

        {/* Notification */}

        <button
          className="
            relative
            p-2
            rounded-xl
            hover:bg-gray-100
          "
        >
          <Bell size={20} />

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