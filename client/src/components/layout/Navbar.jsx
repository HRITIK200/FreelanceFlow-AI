import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, Search } from "lucide-react";

export default function Navbar() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
 className="
 bg-white
 shadow-sm
 px-6
 py-4
 flex
 justify-between
 items-center
 "
>

  <div className="flex items-center gap-3">

    <Search size={18} />

    <input
      type="text"
      placeholder="Search..."
      className="
      border
      rounded-lg
      px-3
      py-2
      w-64
      "
    />

  </div>

  <div className="flex items-center gap-5">

    <Bell size={20} />

    <div
      className="
      h-10
      w-10
      rounded-full
      bg-blue-600
      text-white
      flex
      items-center
      justify-center
      font-bold
      "
    >
      H
    </div>

  </div>

</div>
  );
}