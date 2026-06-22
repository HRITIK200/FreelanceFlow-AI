import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({
  stats,
}) {

  const data = [
    {
      name: "Revenue",
      value: stats.paidRevenue,
    },
    {
      name: "Pending",
      value: stats.pendingRevenue,
    },
    {
      name: "Projects",
      value: stats.totalProjects,
    },
    {
      name: "Clients",
      value: stats.totalClients,
    },
  ];

  const hasData =
    stats.totalClients > 0 ||
    stats.totalProjects > 0 ||
    stats.completedProjects > 0 ||
    stats.totalInvoices > 0; 

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Revenue Analytics
      </h2>
      
      {
         !hasData ? (

        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
           <p className="text-lg font-medium">
              No Analytics Data
           </p>

           <p className="text-sm">
             Add clients, projects and invoices to view analytics.
           </p>
         </div>

         ) : (

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
          />
         <defs>
            <linearGradient
               id="colorGradient"
               x1="0"
               y1="0"
               x2="0"
               y2="1">
             <stop
                offset="0%"
                stopColor="#2563eb"/>
             <stop
                offset="100%"
                stopColor="#60a5fa"/> 
            </linearGradient>
         </defs>
        </BarChart>
      </ResponsiveContainer>
         )
      }

    </div>
  );
}