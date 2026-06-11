import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../../api/authApi";

import { Eye,EyeOff } from "lucide-react";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
     useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await registerUser(formData);

      toast.success(
        "Account created successfully"
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6">
      
      <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <h1 className="text-5xl font-bold mb-6">
          Start Your Freelance Journey
        </h1>
        <p className="text-lg mb-6">
         Create your account and manage
           clients, projects and invoices
           from one place.
        </p>
        <div className="space-y-4">
          <p>✅ Manage Clients</p>
          <p>✅ Track Projects</p>
          <p>✅ Generate Invoices</p>
          <p>✅ Monitor Growth</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl  p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl  p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
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
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition"
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}