export default function AIInsights({
  stats,
}) {

  const insights = [];

  if (stats.overdueInvoices > 0) {
    insights.push(
      `⚠️ ${stats.overdueInvoices} overdue invoice(s) require attention`
    );
  }

  if (stats.pendingRevenue > 0) {
    insights.push(
      `💰 Pending revenue ₹${stats.pendingRevenue.toLocaleString()}`
    );
  }

  if (
    stats.totalProjects > 0 &&
    stats.completedprojects > 0
  ) {

    const completionRate =
      Math.round(
        (
          stats.completedprojects /
          stats.totalProjects
        ) * 100
      );

    insights.push(
      `🚀 ${completionRate}% projects completed`
    );
  }

  if (
    stats.paidRevenue >
    stats.pendingRevenue
  ) {
    insights.push(
      "📈 Revenue trend looks healthy"
    );
  }

  if (insights.length === 0) {
    insights.push(
      "🎉 Everything looks good!"
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        AI Insights
      </h2>

      <div className="space-y-3">

        {insights.map(
          (insight, index) => (

          <div
            key={index}
            className="
              bg-slate-50
              rounded-xl
              p-3
              text-sm
            "
          >
            {insight}
          </div>

        ))}

      </div>
    </div>
  );
}