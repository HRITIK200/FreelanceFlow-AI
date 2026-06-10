import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {

  const { logout } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout =
    () => {

      logout();

      navigate("/login");
    };

  return (
    <div className="min-h-screen p-10">

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mt-6">
        Dashboard
      </h1>

    </div>
  );
}