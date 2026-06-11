import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
     useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const data =
          await loginUser(
            formData
          );

        login(
          data.token
        );

        toast.success(
          "Login successful"
        );

        navigate(
          "/dashboard"
        );

      } catch (error) {

        console.log(error);

        toast.error("Login failed");

      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6">
      <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <h1 className="text-5xl font-bold mb-6">
          FreelanceFlow AI
        </h1>
        <p className="text-lg mb-6">
          Manage your freelance business professionally from one dashboard.
        </p>
        <div className="space-y-4">
          <p>✅ Client Management</p>
          <p>✅ Project Tracking</p>
          <p>✅ Invoice Generation</p>
          <p>✅ Activity Monitoring</p>
        </div>
      </div>

      
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2"
      >

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"

          value={formData.email}

          onChange={handleChange}

          className="w-full border border-gray-300 rounded-xl  p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <div className="relative">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    value={formData.password}
    onChange={(e) =>
      setFormData({
        ...formData,
        password: e.target.value,
      })
    }
    className="
      w-full
      border
      border-gray-300
      rounded-xl
      p-4
      pr-12
      focus:ring-2
      focus:ring-blue-500
      focus:outline-none
    "
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-gray-500
    "
  >
    {
      showPassword
        ? <EyeOff size={20} />
        : <Eye size={20} />
    }
  </button>

</div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition"
        >
          Login
        </button>
       
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500"
          >
            Register
          </Link>
        </p>
      </form>
      
      

    </div>
  );
}