import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";

export default function Navbar({
  setSidebarOpen,
}) {
  const { logout } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout =
    () => {
      logout();
      navigate("/login");
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

        <div
          className="
            hidden
            sm:flex
            items-center
            gap-3
            bg-gray-100
            rounded-xl
            px-4
            py-2
            w-72
          "
        >
          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none
              w-full
            "
          />
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
            3
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
            User
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Freelancer
          </p>
        </div>

        <div
          className="
            h-11
            w-11
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            shadow-md
          "
        >
          H
        </div>

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