import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboardApi";

import {
  User,
  Mail,
  Shield,
  IndianRupee,
  Users,
  FolderKanban,
  Receipt,
} from "lucide-react";

export default function Profile() {

  const { user } = useAuth();

  const [stats, setStats] =
    useState({
      totalClients: 0,
      totalProjects: 0,
      totalInvoices: 0,
      paidRevenue: 0,
    });

  useEffect(() => {

    const fetchStats =
      async () => {

        try {

          const data =
            await getDashboardStats();

          setStats(data);

        } catch (error) {

          console.log(error);

        }
      };

    fetchStats();

  }, []);

  return (
    <DashboardLayout>

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Card */}

          <div
            className="
              bg-white
              rounded-2xl
              shadow-md
              p-8
              text-center
            "
          >

            <div
              className="
                h-28
                w-28
                mx-auto
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                text-4xl
                font-bold
                flex
                items-center
                justify-center
                mb-5
              "
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <h2 className="text-2xl font-bold">
              {user?.name}
            </h2>

            <p className="text-gray-500 mt-1">
              Freelancer
            </p>

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                bg-green-100
                text-green-700
                px-4
                py-2
                rounded-full
              "
            >
              <Shield size={16} />
              Active Account
            </div>

          </div>

          {/* Right Card */}

          <div
            className="
              lg:col-span-2
              bg-white
              rounded-2xl
              shadow-md
              p-8
            "
          >

            <h2 className="text-2xl font-bold mb-6">
              Account Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <User size={20} />

                <div>
                  <p className="text-gray-500 text-sm">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {user?.name}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <Mail size={20} />

                <div>
                  <p className="text-gray-500 text-sm">
                    Email
                  </p>

                  <p className="font-semibold">
                    {user?.email}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <Shield size={20} />

                <div>
                  <p className="text-gray-500 text-sm">
                    Role
                  </p>

                  <p className="font-semibold">
                    {user?.role === "USER"
                      ? "Freelancer"
                      : user?.role}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
            mt-8
          "
        >

          <div className="bg-white rounded-2xl shadow-md p-6">
            <Users size={24} />
            <h3 className="text-3xl font-bold mt-3">
              {stats.totalClients}
            </h3>
            <p className="text-gray-500">
              Clients
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <FolderKanban size={24} />
            <h3 className="text-3xl font-bold mt-3">
              {stats.totalProjects}
            </h3>
            <p className="text-gray-500">
              Projects
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <Receipt size={24} />
            <h3 className="text-3xl font-bold mt-3">
              {stats.totalInvoices}
            </h3>
            <p className="text-gray-500">
              Invoices
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <IndianRupee size={24} />
            <h3 className="text-3xl font-bold mt-3">
              ₹{stats.paidRevenue}
            </h3>
            <p className="text-gray-500">
              Revenue
            </p>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}