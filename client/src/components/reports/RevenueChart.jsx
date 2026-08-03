import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({ stats = {} }) {
  const paidRevenue = stats?.paidRevenue || 0;
  const pendingRevenue = stats?.pendingRevenue || 0;
  const totalProjects = stats?.totalProjects || 0;
  const totalClients = stats?.totalClients || 0;
  const completedProjects = stats?.completedProjects || 0;
  const totalInvoices = stats?.totalInvoices || 0;

  const data = [
    { name: "Revenue", value: paidRevenue },
    { name: "Pending", value: pendingRevenue },
    { name: "Projects", value: totalProjects },
    { name: "Clients", value: totalClients },
  ];

  const hasData =
    totalClients > 0 ||
    totalProjects > 0 ||
    completedProjects > 0 ||
    totalInvoices > 0;

  return (
    <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Revenue Analytics
      </h2>

      {!hasData ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            No Analytics Data
          </p>
          <p className="text-sm">
            Add clients, projects and invoices to view analytics.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => (typeof value === "number" ? `₹${value.toLocaleString()}` : value)}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}