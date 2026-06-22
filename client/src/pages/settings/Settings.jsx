import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
  User,
  Shield,
  Bell,
  AlertTriangle,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account preferences and security
          </p>
        </div>

        {/* User Banner */}

<div
  className="
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    rounded-3xl
    p-6
    text-white
    mb-6
  "
>
  <div className="flex flex-col sm:flex-row items-center gap-4">

    <div
      className="
        h-16
        w-16
        rounded-full
        bg-white/20
        flex
        items-center
        justify-center
        text-2xl
        font-bold
      "
    >
      {user?.name?.charAt(0)?.toUpperCase()}
    </div>

    <div>
      <h2 className="text-2xl font-bold">
        {user?.name}
      </h2>

      <p className="text-blue-100">
        {user?.email}
      </p>

      <span
        className="
          inline-block
          mt-2
          px-3
          py-1
          rounded-full
          bg-white/20
          text-sm
        "
      >
        Freelancer
      </span>
    </div>

  </div>
</div>

        {/* Profile Information */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
            <User size={24} />
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-xl p-3"
            />

          </div>

          <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
            Save Changes
          </button>

        </div>

        {/* Security */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
            <Shield size={24} />
            Security
          </h2>

          <div className="grid gap-4">

            <input
              type="password"
              placeholder="Current Password"
              className="border rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="New Password"
              className="border rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="border rounded-xl p-3"
            />

          </div>

          <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl">
            Update Password
          </button>

        </div>

        {/* Notifications */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
            <Bell size={24} />
            Notifications
          </h2>

          <div className="space-y-5">

            <label className="flex justify-between">
              Email Notifications
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" />
            </label>

            <label className="flex justify-between">
              Invoice Reminders
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" />
            </label>

            <label className="flex justify-between">
              Project Alerts
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-blue-600" />
            </label>

          </div>

        </div>

        {/* Danger Zone */}

        <div className="bg-red-50 border border-red-200 rounded-3xl p-8">

          <h2 className="flex items-center gap-2 text-xl font-bold text-red-600">
            <AlertTriangle size={22} />
            Danger Zone
          </h2>

          <p className="text-gray-600 mt-2">
            Permanently delete your account.
          </p>

          <button className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl">
            Delete Account
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}