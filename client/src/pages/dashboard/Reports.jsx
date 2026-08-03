import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { getDashboardStats, getReports } from "../../api/dashboardApi";
import RevenueChart from "../../components/reports/RevenueChart";
import { Download, BarChart3, Users, FolderKanban, Receipt, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { exportToExcel } from "../../utils/exportToExcel";
import Skeleton from "../../components/ui/Skeleton";

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

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sData, rData] = await Promise.all([
          getDashboardStats().catch(() => null),
          getReports().catch(() => null),
        ]);

        if (sData) setStats(sData);
        if (rData) setReportData(rData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const collectionRate = reportData?.collectionRate ?? (
    stats.totalInvoices > 0
      ? Math.round((stats.paidRevenue / (stats.paidRevenue + (stats.pendingRevenue || 0))) * 100)
      : 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                <BarChart3 size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reports & Analytics</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">Track business performance, collection rates, and revenue growth</p>
          </div>

          <button
            onClick={() =>
              exportToExcel(
                [
                  {
                    PaidRevenue: stats.paidRevenue,
                    PendingRevenue: stats.pendingRevenue,
                    Clients: stats.totalClients,
                    Projects: stats.totalProjects,
                    Invoices: stats.totalInvoices,
                    CollectionRate: `${collectionRate}%`,
                  },
                ],
                "Business_Performance_Report"
              )
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition"
          >
            <Download size={16} /> Export Executive Summary
          </button>
        </div>

        {/* ── Metric Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Collected</p>
            <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
              ₹{(stats.paidRevenue || 0).toLocaleString()}
            </h2>
          </div>

          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Clients</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {stats.totalClients}
            </h2>
          </div>

          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Projects</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {stats.totalProjects}
            </h2>
          </div>

          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection Rate</p>
            <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
              {collectionRate}%
            </h2>
            <div className="w-full bg-gray-100 dark:bg-white/[0.06] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Status Breakdown ───────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-emerald-50/50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 p-6">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Completed Projects</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
              {stats.completedProjects}
            </h3>
          </div>

          <div className="bg-amber-50/50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 p-6">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Revenue</p>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
              ₹{(stats.pendingRevenue || 0).toLocaleString()}
            </h3>
          </div>

          <div className="bg-red-50/50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 p-6">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Overdue Invoices</p>
            <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-2">
              {stats.overdueInvoices}
            </h3>
          </div>
        </div>

        {/* ── Revenue Chart ──────────────────────────────────────── */}
        <div className="mb-8">
          <RevenueChart stats={stats} />
        </div>

        {/* ── Top Clients Breakdown (if available) ─────────────── */}
        {reportData?.topClients && reportData.topClients.length > 0 && (
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Clients by Revenue</h2>
            <div className="space-y-3">
              {reportData.topClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e2433] rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.completedCount} of {client.projectCount} projects completed</p>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                    ₹{client.paidRevenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}