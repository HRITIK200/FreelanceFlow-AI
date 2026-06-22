import DashboardLayout from "../../components/layout/DashboardLayout";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboardApi";

import RevenueChart from "../../components/reports/RevenueChart";

import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportToExcel";

export default function Reports() {

 const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedProjects: 0,
    paidRevenue: 0,
    totalInvoices: 0,
    pendingRevenue: 0,
    overdueInvoices: 0,
 });

  useEffect(() => {


    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch(error){
            console.log(error);
        }
    };

  fetchStats();
 }, []);

 const collectionRate =
   stats.totalInvoices > 0
     ? Math.round(
        (stats.paidRevenue /
            (stats.paidRevenue +
                (stats.pendingRevenue || 0))) * 100
     ) : 0;

  return (
    <DashboardLayout>

<div className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
mb-8
">

  <div>

    <h1 className="text-4xl font-bold">
      Reports & Analytics
    </h1>

    <p className="text-gray-500 mt-2">
      Track business growth and revenue insights
    </p>

  </div>

  <button
    onClick={() =>
      exportToExcel(
        [
          {
            Revenue:
              stats.paidRevenue,

            PendingRevenue:
              stats.pendingRevenue,

            Clients:
              stats.totalClients,

            Projects:
              stats.totalProjects,

            Invoices:
              stats.totalInvoices,
          },
        ],
        "Business_Report"
      )
    }
    className="
      mt-4
      md:mt-0
      bg-green-600
      hover:bg-green-700
      text-white
      px-5
      py-3
      rounded-xl
      flex
      items-center
      gap-2
      transition
    "
  >
    <Download size={18} />

    Export Report

  </button>

</div>
<div className="grid md:grid-cols-4 gap-4 mb-8">

  <div className="bg-white p-6 rounded-3xl shadow">
    <p>Total Revenue</p>
    <h2 className="text-3xl font-bold">
      ₹{(stats.paidRevenue || 0).toLocaleString()}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <p>Total Clients</p>
    <h2 className="text-3xl font-bold">
      {stats.totalClients}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <p>Total Projects</p>
    <h2 className="text-3xl font-bold">
      {stats.totalProjects}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <p>Collection Rate</p>
    <h2 className="text-3xl font-bold">
      {collectionRate}%
    </h2>

    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">

        <div className="bg-green-600 h-3 rounded-full transition-all duration-500"
             style={{
                width:`${collectionRate}%`,
             }}
             />
    </div>
  </div>

</div>

<div className="grid md:grid-cols-3 gap-4 mb-8">

    {/* Completed Projects */}

    <div className="bg-green-50 rounded-3xl p-6">

        <p className="text-gray-500">
            Completed Projects
        </p>

        <h3 className="text-3xl font-bold text-green-600 mt-2">
           {stats.completedProjects} 
        </h3>
    </div>

    {/* Pending Revenue */}

     <div className="bg-yellow-50 rounded-3xl p-6">

       <p className="text-gray-500">
         Pending Revenue
       </p> 
       <h3 className="text-3xl font-bold text-yellow-600 mt-2">
         ₹{(stats.pendingRevenue || 0).toLocaleString()}
       </h3>
     </div>

     {/* Overdue Invoices */}

     <div className="bg-red-50 rounded-3xl p-6">

        <p className="text-gray-500">
            Overdue Invoices
        </p>

        <h3 className="text-3xl font-bold text-red-600 mt-2">
             {stats.overdueInvoices}
        </h3>
     </div>
   </div>

   {/* Revenue Analytics Chart */}

   <div className="mb-8">
      <RevenueChart stats={stats} />
    </div>

    {/* Business Health */}

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      
      <h2 className="text-2xl font-bold mb-6">
        Business Health
      </h2>

      <div className="space-y-5">
        <div className="flex justify-between">

            <span className="text-gray-500">
                Total Revenue
            </span>
            <span className="font-bold text-green-600">
                ₹{(stats.paidRevenue || 0).toLocaleString()}
            </span>
        </div>

        <div className="flex justify-between">

            <span className="text-gray-500">
                Pending Revenue
            </span>

            <span className="font-bold text-yellow-600">
               ₹{(stats.pendingRevenue || 0).toLocaleString()} 
            </span>
        </div>

        <div className="flex justify-between">

            <span className="text-gray-500">
                Overdue Invoices
            </span>

            <span className="font-bold text-red-600">
               {stats.overdueInvoices}  
            </span>
        </div>

        <div className="flex justify-between">

            <span className="text-gray-500">
                Collection Rate
            </span>

            <span className="font-bold text-blue-600">
              {collectionRate}%  
            </span>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mt-8">

        <div className="bg-green-50 rounded-3xl p-6">

            <h3 className="text-green-600 font-semibold">
                Revenue Status
            </h3>

            <p className="text-2xl font-bold mt-2">
                Healthy
            </p>

        </div>

        <div className="bg-blue-50 rounded-3xl p-6">

          <h3 className="text-blue-600 font-semibold">
            Client Growth
          </h3>

          <p className="text-2xl font-bold mt-2">
            {stats.totalClients}
          </p>
        </div>

        <div className="bg-purple-50 rounded-3xl p-6">

            <h3 className="text-purple-600 font-semibold">
                Active Projects
            </h3>

            <p className="text-2xl font-bold mt-2">
                {stats.totalProjects}
            </p>
        </div>
    </div>
    
    </DashboardLayout>
  );
}