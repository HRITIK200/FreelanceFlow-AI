import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getDashboardStats,
} from "../../api/dashboardApi";

import DashboardChart from "../../components/dashboard/DashboardChart";

import {
  getActivities,
} from "../../api/activityApi";

import StatCard from "../../components/ui/StatCard";

export default function Dashboard() {

  const [stats, setStats] =
    useState({
      totalClients: 0,
      totalProjects: 0,
      completedprojects: 0,
      totalInvoices: 0,
      paidrevenue: 0,
      pendingRevenue: 0,
      overdueInvoices: 0,
    });

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
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">

          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon="👥"
          />

          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon="📁"
          />

          <StatCard
            title="Paid Revenue"
            value={`₹${stats.paidRevenue}`}
            icon="💰"
          />
          <StatCard
            title="Pending Revenue"
            value={`₹${stats.pendingRevenue}`}
            icon="⏳"
          />
          <StatCard
            title="Completed"
            value={stats.completedprojects}
            icon="✅"
          />
          <StatCard
            title="Overdue"
            value={stats.overdueInvoices}
            icon="⚠️"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Business Overview
          </h2>
          <DashboardChart
             stats={stats}
             />
        </div>
        </>
      )}
        
      
      

      <div className="border-b py-3 hover:bg-gray-50 px-2 rounded">

        <h2 className="text-xl font-bold mb-4">
          Recent Activity
        </h2>
        
        {activities.length === 0 ? (
          <p className="text-gray-500">
            No activity found
          </p>
        ) : (

        activities.map(
          (activity) => (

          <div
            key={activity.id}
            className="border-1-4 border-blue-500 pl-4 py-3 mb-4 bg-slate-50 rounded-r-lg"
          >
          <div className="font-medium">
            {activity.details}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {new Date(
               activity.createdAt
            ).toLocaleString()}

          </div>
          </div>
          )
        )
        )}

      </div>

    </DashboardLayout>
  );
}