import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getDashboardStats,
} from "../../api/dashboardApi";

import {
  getActivities,
} from "../../api/activityApi";

export default function Dashboard() {

  const [stats, setStats] =
    useState(null);

  const [activities,
    setActivities] =
    useState([]);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const statsData =
            await getDashboardStats();

          const activityData =
            await getActivities();

          setStats(
            statsData
          );

          setActivities(
            activityData
          );

        } catch (error) {

          console.log(error);

        }
      };

    fetchData();

  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {stats && (

        <div className="grid grid-cols-4 gap-4 mb-8">

          <div className="bg-white shadow rounded p-4">
            <h2>Total Clients</h2>
            <p className="text-2xl font-bold">
              {stats.totalClients}
            </p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2>Total Projects</h2>
            <p className="text-2xl font-bold">
              {stats.totalProjects}
            </p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2>Paid Revenue</h2>
            <p className="text-2xl font-bold">
              ₹{stats.paidRevenue}
            </p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2>Pending Revenue</h2>
            <p className="text-2xl font-bold">
              ₹{stats.pendingRevenue}
            </p>
          </div>

        </div>
      )}

      <div className="bg-white shadow rounded p-4">

        <h2 className="text-xl font-bold mb-4">
          Recent Activity
        </h2>

        {activities.map(
          (activity) => (

          <div
            key={activity.id}
            className="border-b py-2"
          >

            {activity.details}

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
}