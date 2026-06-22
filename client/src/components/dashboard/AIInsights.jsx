import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";

export default function AIInsights({
  stats,
}) {

  const insights = [];

  const completionRate =
    stats.totalProjects > 0
      ? Math.round(
        (
          stats.completedProjects /
          stats.totalProjects
        ) * 100
      ) : 0;

  let score = 50;

  if(stats.totalClients > 0) score += 10;
  if(stats.totalProjects > 0) score += 10;
  if(stats.completedProjects > 0) score +=10;
  if(stats.paidRevenue > 0) score +=10;

  score -= stats.overdueInvoices * 5;

  score = Math.max(
    0,
    Math.min(score, 100)
  );

  if(stats.totalClients === 0){
    insights.push(
      "Add your first client to start managing projects."
    );
  }

  if(
    stats.totalClients > 0 &&
    stats.totalProjects === 0
  ){
    insights.push(
      "You have clients but no projects. Create your first project."
    );
  }

  if (stats.overdueInvoices > 0) {
    insights.push({
      icon: <AlertTriangle size={20} />,
      text: `${stats.overdueInvoices} overdue invoice(s) require immediate attention`,
      color: "bg-red-50 text-red-600",
    });
  }

  if(
    stats.totalProjects > 0 &&
    completionRate < 50
  ){
    insights.push({
      icon: <AlertTriangle size={20} />,
      text: "Project completion rate is below 50%. Focus on finishing active projects.",
      color: "bg-orange-50 text-orange-600",
    });
  }

  if(
    stats.totalClients >= 5
  ){
    insights.push({
      icon: <TrendingUp size={20} />,
      text: `You have ${stats.totalClients} active clients. Business growth looks healthy.`,
      color: "bg-blue-50 text-blue-600",
    });
  }

  if(
    stats.paidRevenue >= 50000
  ){
    insights.push({
      icon: <Sparkles size={20} />,
      text: "Congratulations! You've crossed ₹50,000 in revenue.",
      color: "bg-purple-50 text-purple-600",
    });
  }

  if (stats.pendingRevenue > 0) {
    insights.push({
      icon: <CircleDollarSign size={20} />,
      text: `Pending revenue of ₹${stats.pendingRevenue.toLocaleString()} can be recovered`,
      color: "bg-yellow-50 text-yellow-600",
    });
  }

  if (
    stats.totalProjects > 0 &&
    stats.completedProjects > 0
  ) {

    const completionRate =
      Math.round(
        (
          stats.completedProjects /
          stats.totalProjects
        ) * 100
      );

    insights.push({
      icon: <TrendingUp size={20} />,
      text: `${completionRate}% project completion rate achieved`,
      color: "bg-blue-50 text-blue-600",
    });
  }

  if (
    stats.paidRevenue >
    stats.pendingRevenue
  ) {
    insights.push({
      icon: <Brain size={20} />,
      text: `₹${stats.paidRevenue.toLocaleString()} revenue collected successfully`,
      color: "bg-green-50 text-green-600",
    });
  }

  if(
    stats.completedProjects > 0 &&
    stats.overdueInvoices === 0 &&
    stats.pendingRevenue === 0
  ){
    insights.push({
      icon: <Sparkles size={20} />,
      text: "Excellent! No pending revenue and no overdue invoices. ",
      color: "bg-green-50 text-green-600",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: <Brain size={20} />,
      text: "Everything looks good. Keep growing your business.",
      color: "bg-green-50 text-green-600",
    });
  }

  return (
    <div
      className="
      bg-white
      rounded-3xl
      border
      border-gray-100
      shadow-sm
      p-6
    "
    >

      <div className="flex items-center gap-3 mb-6">

        <div
          className="
          h-12
          w-12
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          flex
          items-center
          justify-center
        "
        >
          <Brain size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            AI Insights
          </h2>

          <div>

            <p className="text-sm text-gray-500">
               Smart business recommendations
            </p>
            <p className="text-sm font-medium text-blue-600">
              Business Health Score: {score}/100
            </p>
          </div>
        </div>

      </div>

      <div className="space-y-4">

        {insights.map(
          (insight, index) => (

            <div
              key={index}
              className={`
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                ${insight.color}
              `}
            >
              {insight.icon}

              <p className="font-medium">
                {insight.text}
              </p>
            </div>

          )
        )}

      </div>

    </div>
  );
}