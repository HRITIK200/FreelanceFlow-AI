import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  BriefcaseBusiness,
  Users,
  FolderKanban,
  Receipt,
  TrendingUp,
} from "lucide-react";

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
        
        console.log("LOGIN RESPONSE:", data);

        login(
          data.token,
          data.user
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
  <div
    className="
      min-h-screen
      bg-gradient-to-br
      from-blue-600
      via-indigo-600
      to-purple-700
      flex
      items-center
      justify-center
      p-4
      md:p-8
    "
  >
    <div className="w-full max-w-5xl">

      {/* Mobile Branding */}

      <div
        className="
          md:hidden
          text-center
          text-white
          mb-6
        "
      >
        <div className="flex items-center justify-center gap-2">
          <BriefcaseBusiness size={28} />
          <h1 className="text-3xl font-bold">
            FreelanceFlow AI
          </h1>
        </div>

        <p className="mt-2 text-blue-100">
          Manage Clients, Projects & Invoices
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Clients
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Projects
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Invoices
          </span>
        </div>
      </div>

      <div
        className="
          bg-white/10
          backdrop-blur-md
          rounded-3xl
          overflow-hidden
          shadow-2xl
          transition-all
          duration-300
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          grid
          md:grid-cols-2
        "
      >
        {/* LEFT PANEL */}

        <div
          className="
            hidden
            md:flex
            flex-col
            justify-center
            p-14
            text-white
            bg-gradient-to-br
            from-blue-700
            via-indigo-800
            to-purple-700
          "
        >
          <div className="flex items-center gap-4 mb-10">
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-white/20
                flex
                items-center
                justify-center
              "
            >
              <BriefcaseBusiness size={30} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                FreelanceFlow AI
              </h2>

              <p className="text-blue-100">
                Smart Freelance Management
              </p>
            </div>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Welcome Back
          </h1>

          <p className="text-lg text-blue-100 mb-10">
            Login to manage clients,
            projects, invoices and track
            your freelance business growth.
          </p>

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <Users size={22} />
              <span>Manage Clients</span>
            </div>

            <div className="flex items-center gap-3">
              <FolderKanban size={22} />
              <span>Track Projects</span>
            </div>

            <div className="flex items-center gap-3">
              <Receipt size={22} />
              <span>Generate Invoices</span>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp size={22} />
              <span>Monitor Growth</span>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          className="
            bg-white
            p-8
            md:p-14
            flex
            items-center
          "
        >
          <form
            onSubmit={handleSubmit}
            className="w-full"
          >
            <h1 className="text-4xl font-bold text-center mb-2">
              Welcome Back
            </h1>

            <p className="text-center text-gray-500 mb-8">
              Login to continue managing
              your freelance business.
            </p>

            <div className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  focus:ring-2
                  focus:ring-blue-500
                  focus:outline-none
                "
              />

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                  className="
                    w-full
                    bg-gray-50
                    border
                    border-gray-200
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
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              <button
                type="submit"
                className="
                  w-full
                  py-4
                  rounded-xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                Login
              </button>

            </div>

            <p className="text-center mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="
                  text-blue-600
                  font-semibold
                  hover:underline
                "
              >
                Register
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-6">
              Secure Authentication • JWT Protected
            </p>

          </form>
        </div>
      </div>
    </div>
  </div>
);
}