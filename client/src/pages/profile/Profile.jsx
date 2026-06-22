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

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information
          </p>

        </div>

        {/* Profile Header */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl
                          p-8 text-white mb-8">
         <div className="flex items-center gap-6">

      <div
      className="
      h-24
      w-24
      rounded-full
      bg-white/20
      flex
      items-center
      justify-center
      text-4xl
      font-bold
      "
    >
      {user?.name?.charAt(0)?.toUpperCase()}
         </div>

    <div>
      <h1 className="text-4xl font-bold">
        {user?.name}
      </h1>

      <p className="text-blue-100 text-lg">
        {user?.email}
      </p>

      <span
        className="
        inline-flex
        items-center
        gap-2
        mt-3
        px-4
        py-2
        rounded-full
        bg-white/20
        text-sm
        "
      >
       🟢 Active Freelancer
      </span>
    </div>

  </div>
</div>

<div
  className="
  bg-white
  rounded-3xl
  shadow-lg
  border
  border-gray-100
  p-8
"
>
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">
    Account Information
  </h2>
  <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-medium">
    Active Freelancer
  </span>
  </div>

  <div className="space-y-4">

    <div
      className="
      flex
      items-center
      gap-4
      p-4
      bg-slate-50
      rounded-xl
    "
    >
      <User size={22} />

      <div>
        <p className="text-sm text-gray-500">
          Full Name
        </p>

        <p className="font-semibold">
          {user?.name}
        </p>
      </div>
    </div>

    <div
      className="
      flex
      items-center
      gap-4
      p-4
      bg-slate-50
      rounded-xl
    "
    >
      <Mail size={22} />

      <div>
        <p className="text-sm text-gray-500">
          Email
        </p>

        <p className="font-semibold">
          {user?.email}
        </p>
      </div>
    </div>

    <div
      className="
      flex
      items-center
      gap-4
      p-4
      bg-slate-50
      rounded-xl
    "
    >
      <Shield size={22} />

      <div>
        <p className="text-sm text-gray-500">
          Role
        </p>

        <p className="font-semibold">
          Freelancer
        </p>
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

  {/* Clients */}

  <div
    className="
    bg-white
    rounded-3xl
    shadow-sm
    border
    border-gray-100
    p-6
    hover:shadow-lg
    transition
  "
  >
    <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
       <Users size={22} />
     </div>

    <h3 className="text-3xl font-bold mt-3">
      {stats.totalClients}
    </h3>

    <p className="text-gray-500">
      Clients
    </p>
  </div>

  {/* Projects */}

  <div
    className="
    bg-white
    rounded-3xl
    shadow-sm
    border
    border-gray-100
    p-6
    hover:shadow-lg
    transition
  "
  >
    <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
       <FolderKanban size={22} />
    </div>

    <h3 className="text-3xl font-bold mt-3">
      {stats.totalProjects}
    </h3>

    <p className="text-gray-500">
      Projects
    </p>
  </div>

  {/* Invoices */}

  <div
    className="
    bg-white
    rounded-3xl
    shadow-sm
    border
    border-gray-100
    p-6
    hover:shadow-lg
    transition
  "
  >
    <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
        <Receipt size={22} />
    </div>

    <h3 className="text-3xl font-bold mt-3">
      {stats.totalInvoices}
    </h3>

    <p className="text-gray-500">
      Invoices
    </p>
  </div>

  {/* Revenue */}

  <div
    className="
    bg-white
    rounded-3xl
    shadow-sm
    border
    border-gray-100
    p-6
    hover:shadow-lg
    transition
  "
  >
    <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
       <IndianRupee size={22} />
    </div>

    <h3 className="text-3xl font-bold mt-3">
      ₹{stats.paidRevenue}
    </h3>

    <p className="text-gray-500">
      Revenue
    </p>
  </div>

</div>

{/* Account Summary */}

<div
  className="
  bg-white
  rounded-3xl
  shadow-sm
  border
  border-gray-100
  p-8
  mt-8
"
>
  <div className="flex items-center justify-between mb-6">

  <h2 className="text-2xl font-bold">
    Account Summary
  </h2>

  <span
    className="
      px-4
      py-2
      rounded-full
      bg-blue-100
      text-blue-600
      text-sm
      font-medium
    "
  >
    Business Overview
  </span>

</div>

  <div className="grid md:grid-cols-2 gap-6">

    <div
      className="
      p-6
      bg-green-50
      rounded-2xl
    "
    >
      <p className="text-gray-500">
        Total Revenue
      </p>

      <h3 className="text-3xl font-bold text-green-600 mt-2">
        ₹{stats.paidRevenue}
      </h3>
    </div>

    <div
      className="
      p-6
      bg-blue-50
      rounded-2xl
    "
    >
      <p className="text-gray-500">
        Projects Managed
      </p>

      <h3 className="text-3xl font-bold text-blue-600 mt-2">
        {stats.totalProjects}
      </h3>
    </div>

  </div>
</div>

</div>

    </DashboardLayout>
  );
}