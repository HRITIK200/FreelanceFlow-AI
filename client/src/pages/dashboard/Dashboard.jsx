import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getDashboardStats } from "../../api/dashboardApi";
import { getActivities } from "../../api/activityApi";

import DashboardChart from "../../components/dashboard/DashboardChart";
import StatCard from "../../components/ui/StatCard";

import AIInsights
from "../../components/dashboard/AIInsights";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  Users,
  UserPlus,
  FolderPlus,
  ReceiptText,
  FolderKanban,
  IndianRupee,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalInvoices: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    overdueInvoices: 0,
  });

  const [activities, setActivities] = useState([]);

  const { user } = useAuth();


  const completionRate =
    stats.totalProjects > 0
      ? Math.round(
        (
          stats.completedProjects /
          stats.totalProjects
        ) * 100
      ) : 0;
  

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

  const getActivityIcon = (text) => {

    const value = text.toLowerCase();

    if (value.includes("created"))
      return <PlusCircle size={20} />;

    if (value.includes("updated"))
      return <Pencil size={20} />;

    if(value.includes("deleted"))
      return <Trash2 size={20} />;

    if(value.includes("email"))
      return <Mail size={20} />;

    if(value.includes("invoice"))
      return <ReceiptText size={20} />

    if(value.includes("project"))
      return <FolderKanban size={20} />

    return <Clock3 size={20} />
  };


  
  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Back, {user?.name}
        </h1>

        {
          stats.totalClients === 0 &&
          stats.totalProjects === 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-blue-700">
              🚀 Start by adding your first client and project.
            </p>
            </div>
          )
        }
        <p className="text-gray-500 mt-2">
          Here's your business performance overview today.
        </p>
        <div className="
          mt-4
          grid
          grid-cols-1
          md:grid-cols-4
          gap-4">

        <div className="
          md:col-span-2
          bg-gradient-to-r
         from-blue-600
         to-indigo-600
         text-white
           p-5
           rounded-2xl ">
         <p>Total Revenue</p>
         <h2 className="text-3xl font-bold">
           ₹{(stats.paidRevenue || 0).toLocaleString()}
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
     
    {/* Business Performance Banner */}
    
    <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-start gap-4">

        <div className="text-4xl">
          🎉
        </div>

        <div>

          <h2 className="text-2xl font-bold">
            Business Performance
          </h2>

          <p className="mt-2 text-green-100">
            {
              stats.totalProjects === 0
                ? "Start by creating your first project."
                : completionRate >= 80
                ? "Excellent performance. Keep growing."
                : "Focus on completing more projects."
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="text-green-100 text-sm">
                Success Rate
              </p>

              <p className="text-xl font-bold">
                {completionRate}%
              </p>
            </div>
            <div>
              <p className="text-green-100 text-sm">
                Completed Projects
              </p>
              <p className="text-xl font-bold">
                {stats.completedProjects}
              </p>
            </div>

            <div>
              <p className="text-green-100 text-sm">
                Revenue Generated
              </p>
              <p className="text-xl font-bold">
                ₹{(stats.paidRevenue || 0).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

      {/* Stats Cards */}

      <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-8 ">
        <div >
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={<Users size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={<FolderKanban size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Paid Revenue"
            value={`₹${stats.paidRevenue?.toLocaleString()}`}
            icon={<IndianRupee size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Pending Revenue"
            value={`₹${stats.pendingRevenue?.toLocaleString()}`}
            icon={<Clock3 size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Completed"
            value={stats.completedProjects}
            icon={<CheckCircle2 size={28} />}
          />
        </div>
        
        <div >
          <StatCard
            title="Overdue"
            value={stats.overdueInvoices}
           icon={<AlertTriangle size={28} />}
          />
        </div>
        
        <div >
          <StatCard
            title="Success Rate"
            value={`${completionRate}%`}
            icon={<CheckCircle2 size={28} />}
          />
        </div>
      </div>

      {/* Chart + Quick Actions */}

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
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
          <p className="text-sm text-gray-500 mt-1">
            Clients, Projects and Invoice Analytics
          </p>

          <DashboardChart stats={stats} />
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

          <div className="grid grid-cols-1 gap-4">

            <button onClick={() => navigate("/clients")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-blue-600
              text-white
              flex
              items-center
              gap-3
              hover:scale-105
              transition
            "
            >
              <UserPlus size={24} />
            <span className="font-semibold">
              Add Client
            </span>

            </button>

            <button onClick={() => navigate("/projects")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-blue-600
              text-white
              flex
              items-center
              gap-3
              hover:scale-105
              transition
            "
            >
             <FolderPlus size={32} />

              <span className="font-semibold">
                Add Project
              </span>
            </button>

            <button onClick={() => navigate("/invoices")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-blue-600
              text-white
              flex
              items-center
              gap-3
              hover:scale-105
              transition
            "
            >
              <ReceiptText size={32} />

              <span className="font-semibold">
                Create Invoice
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mb-8">
         <AIInsights
          stats={stats}
          />
      </div>
      
      {/* Recent Activity */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        border
        border-gray-100
        p-8
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

          <button onClick={() => 
            navigate("/activity")
          }
           className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition">
            View All →
           </button>
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center">
             <div className="text-5xl mb-3">
              📋
             </div>

             <h3 className="font-semibold text-lg">
               No Activity Yet
             </h3>

             <p className="text-gray-500 mt-2">
               Your recent actions will appear here.
             </p>
             </div>
        ) : (
          activities
            .slice(0, 5)
            .map((activity) => (
              <div
                key={activity.id}
                className="
                flex
                items-center
                gap-4
                p-5
                mb-4
                rounded-2xl
                border
                border-gray-100
                hover:border-blue-200
                hover:shadow-lg
                transition-all
                duration-300
              "
              >
                <div
                  className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                >
                  {getActivityIcon(activity.details)}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {activity.details}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
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
