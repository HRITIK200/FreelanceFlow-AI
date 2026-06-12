import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getDashboardStats } from "../../api/dashboardApi";
import { getActivities } from "../../api/activityApi";

import DashboardChart from "../../components/dashboard/DashboardChart";
import StatCard from "../../components/ui/StatCard";

import {
  Users,
  FolderKanban,
  IndianRupee,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedprojects: 0,
    totalInvoices: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    overdueInvoices: 0,
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData =
          await getDashboardStats();

        const activityData =
          await getActivities();

        setStats(statsData);
        setActivities(activityData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>
        <div className="
          mt-4
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4">

        <div className="
          bg-gradient-to-r
         from-blue-600
         to-indigo-600
         text-white
           p-5
           rounded-2xl ">
         <p>Total Revenue</p>
         <h2 className="text-3xl font-bold">
           ₹{stats.paidRevenue}
         </h2>
        </div>

        <div className="
         bg-white
           p-5
           rounded-2xl
           shadow ">
         <p>Active Clients</p>
         <h2 className="text-3xl font-bold">
          {stats.totalClients}
         </h2>
        </div>

        <div className="
        bg-white
          p-5
          rounded-2xl
          shadow ">
        <p>Projects</p>
        <h2 className="text-3xl font-bold">
          {stats.totalProjects}
        </h2>
      </div>

</div>

        <p className="text-gray-500 mt-2">
          Here's an overview of your freelance business.
        </p>
      </div>

      {/* Stats Cards */}

      <div
        className="
        flex
        gap-4
        overflow-x-auto
        pb-2
        lg:grid
        lg:grid-cols-3
        xl:grid-cols-6
        mb-8
      "
      >
        <div className="min-w-[220px]">
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={<Users size={28} />}
          />
        </div>

        <div className="min-w-[220px]">
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={<FolderKanban size={28} />}
          />
        </div>

        <div className="min-w-[220px]">
          <StatCard
            title="Paid Revenue"
            value={`₹${stats.paidRevenue}`}
            icon={<IndianRupee size={28} />}
          />
        </div>

        <div className="min-w-[220px]">
          <StatCard
            title="Pending Revenue"
            value={`₹${stats.pendingRevenue}`}
            icon={<Clock3 size={28} />}
          />
        </div>

        <div className="min-w-[220px]">
          <StatCard
            title="Completed"
            value={stats.completedprojects}
            icon={<CheckCircle2 size={28} />}
          />
        </div>

        <div className="min-w-[220px]">
          <StatCard
            title="Overdue"
            value={stats.overdueInvoices}
            icon={<AlertTriangle size={28} />}
          />
        </div>
      </div>

      {/* Chart + Quick Actions */}

      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        mb-8
      "
      >
        {/* Chart */}

        <div
          className="
          xl:col-span-2
          bg-white
          rounded-2xl
          shadow-md
          p-6
        "
        >
          <h2 className="text-xl font-bold mb-4">
            Business Overview
          </h2>

          <div className="h-[350px">
            <DashboardChart stats={stats} />
          </div>
        </div>

        {/* Quick Actions */}

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
        "
        >
          <h2 className="text-xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button
              className="
              p-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-blue-600
              text-white
              hover:scale-105
              transition
            "
            >
            <div className="text-3xl mb-2">
              👤
            </div>
            <h3 className="font-semibold">
              Add Client
            </h3>

            </button>

            <button
              className="
              p-5
              rounded-2xl
              bg-gradient-to-r
              from-indigo-500
              to-indigo-600
              text-white
              hover:scale-105
              transition
            "
            >
              <div className="text-3xl mb-2">
                📁
              </div>

              <h3 className="font-semibold">
                Add Project
              </h3>
            </button>

            <button
              className="
              p-5
              rounded-2xl
              bg-gradient-to-r
            from-purple-500
            to-purple-600
            text-white
              hover:scale-105
              transition
            "
            >
              <div className="text-3xl mb-2">
                🧾
              </div>

              <h3 className="font-semibold">
                Create Invoice
              </h3>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
      "
      >
        <div
          className="
          flex
          items-center
          justify-between
          mb-6
        "
        >
          <h2 className="text-xl font-bold">
            Recent Activity
          </h2>

          <span className="text-sm text-gray-500">
            Latest Updates
          </span>
        </div>

        {activities.length === 0 ? (
          <p className="text-gray-500">
            No activity found
          </p>
        ) : (
          activities
            .slice(0, 5)
            .map((activity) => (
              <div
                key={activity.id}
                className="
                flex
                items-start
                gap-4
                p-4
                mb-4
                rounded-xl
                border
                border-gray-100
                hover:shadow-md
                transition
              "
              >
                <div
                  className="
                  h-10
                  w-10
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                >
                  📌
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    {activity.details}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>

    </DashboardLayout>
  );
}