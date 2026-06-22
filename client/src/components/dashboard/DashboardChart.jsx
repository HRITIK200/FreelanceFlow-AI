import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
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
      color: "#10b981",
    },
    {
      name: "Projects",
      value: stats.totalProjects,
      color: "#2563eb",
    },
    {
      name: "Completed",
      value: stats.completedProjects,
      color: "#8b5cf6",
    },
    {
      name: "Invoices",
      value: stats.totalInvoices,
      color: "#f59e0b",
    },
  ];

  return (
      <ResponsiveContainer
        width="100%"
        height={220}
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            animationDuration={1200}>
            {data.map((entry, index) => (
              <Cell key={index}
                    fill={entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
  );
}