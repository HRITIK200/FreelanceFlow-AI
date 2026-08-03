import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";

export default function AIInsights({ stats = {} }) {
  const insights = [];

  const totalProjects = stats?.totalProjects || 0;
  const completedProjects = stats?.completedProjects || 0;
  const totalClients = stats?.totalClients || 0;
  const paidRevenue = stats?.paidRevenue || 0;
  const pendingRevenue = stats?.pendingRevenue || 0;
  const overdueInvoices = stats?.overdueInvoices || 0;

  const completionRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  let score = 50;
  if (totalClients > 0) score += 10;
  if (totalProjects > 0) score += 10;
  if (completedProjects > 0) score += 10;
  if (paidRevenue > 0) score += 10;

  score -= overdueInvoices * 5;
  score = Math.max(0, Math.min(score, 100));

  if (totalClients === 0) {
    insights.push({
      icon: <Brain size={20} />,
      text: "Add your first client to start managing projects.",
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    });
  } else if (totalProjects === 0) {
    insights.push({
      icon: <Brain size={20} />,
      text: "You have clients but no projects. Create your first project.",
      color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    });
  }

  if (overdueInvoices > 0) {
    insights.push({
      icon: <AlertTriangle size={20} />,
      text: `${overdueInvoices} overdue invoice(s) require immediate attention`,
      color: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    });
  }

  if (totalProjects > 0 && completionRate < 50) {
    insights.push({
      icon: <AlertTriangle size={20} />,
      text: "Project completion rate is below 50%. Focus on finishing active projects.",
      color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    });
  }

  if (totalClients >= 5) {
    insights.push({
      icon: <TrendingUp size={20} />,
      text: `You have ${totalClients} active clients. Business growth looks healthy.`,
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    });
  }

  if (paidRevenue >= 50000) {
    insights.push({
      icon: <Sparkles size={20} />,
      text: "Congratulations! You've crossed ₹50,000 in revenue.",
      color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    });
  }

  if (pendingRevenue > 0) {
    insights.push({
      icon: <CircleDollarSign size={20} />,
      text: `Pending revenue of ₹${pendingRevenue.toLocaleString()} can be recovered`,
      color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    });
  }

  if (totalProjects > 0 && completedProjects > 0) {
    insights.push({
      icon: <TrendingUp size={20} />,
      text: `${completionRate}% project completion rate achieved`,
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    });
  }

  if (paidRevenue > pendingRevenue && paidRevenue > 0) {
    insights.push({
      icon: <Brain size={20} />,
      text: `₹${paidRevenue.toLocaleString()} revenue collected successfully`,
      color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    });
  }

  if (completedProjects > 0 && overdueInvoices === 0 && pendingRevenue === 0) {
    insights.push({
      icon: <Sparkles size={20} />,
      text: "Excellent! No pending revenue and no overdue invoices.",
      color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: <Brain size={20} />,
      text: "Everything looks good. Keep growing your business.",
      color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    });
  }

  return (
    <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
          <Brain size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <div>
            <p className="text-sm text-gray-500">Smart business recommendations</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Business Health Score: {score}/100
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-2xl border border-transparent ${insight.color}`}
          >
            <span className="shrink-0">{insight.icon}</span>
            <p className="font-semibold text-sm">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}