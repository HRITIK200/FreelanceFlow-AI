import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardChart({
  stats,
}) {

  const data = [
    {
      name: "Clients",
      value: stats.totalClients,
    },
    {
      name: "Projects",
      value: stats.totalProjects,
    },
    {
      name: "Completed",
      value: stats.completedProjects,
    },
    {
      name: "Invoices",
      value: stats.totalInvoices,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Business Overview
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3B82F6"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}