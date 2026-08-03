import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getActivities } from "../../api/activityApi";
import { exportToExcel } from "../../utils/exportToExcel";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-hot-toast";

import {
  Activity as ActivityIcon,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  CheckCircle2,
  RefreshCw,
  Download,
  Filter,
  X,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
} from "lucide-react";

/* ── Activity Type Helper ──────────────────────────────────── */
const getActivityMeta = (details = "") => {
  const text = details.toLowerCase();

  if (text.includes("created") || text.includes("added")) {
    return {
      type: "created",
      label: "Created",
      icon: PlusCircle,
      badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      accent: "from-emerald-500 to-teal-600",
    };
  }
  if (text.includes("updated") || text.includes("edited") || text.includes("modified")) {
    return {
      type: "updated",
      label: "Updated",
      icon: Pencil,
      badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      accent: "from-blue-500 to-indigo-600",
    };
  }
  if (text.includes("deleted") || text.includes("removed")) {
    return {
      type: "deleted",
      label: "Deleted",
      icon: Trash2,
      badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20",
      bg: "bg-red-500/10",
      text: "text-red-500",
      accent: "from-red-500 to-rose-600",
    };
  }
  if (text.includes("email") || text.includes("sent") || text.includes("mail")) {
    return {
      type: "email",
      label: "Email",
      icon: Mail,
      badge: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      accent: "from-purple-500 to-pink-600",
    };
  }
  if (text.includes("paid") || text.includes("payment") || text.includes("invoice")) {
    return {
      type: "payment",
      label: "Payment",
      icon: CheckCircle2,
      badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      accent: "from-amber-500 to-orange-600",
    };
  }
  return {
    type: "system",
    label: "System",
    icon: ActivityIcon,
    badge: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20",
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    accent: "from-indigo-500 to-violet-600",
  };
};

/* ── Time Ago Formatter ────────────────────────────────────── */
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivities();
      setActivities(data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  /* ── Stats ──────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayCount = activities.filter(
      (a) => new Date(a.createdAt).toDateString() === today
    ).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekCount = activities.filter(
      (a) => new Date(a.createdAt) >= sevenDaysAgo
    ).length;

    const createdCount = activities.filter((a) =>
      a.details?.toLowerCase().includes("created")
    ).length;

    return {
      total: activities.length,
      today: todayCount,
      week: weekCount,
      created: createdCount,
    };
  }, [activities]);

  /* ── Filtered list ──────────────────────────────────────── */
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.details
        ?.toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === "ALL") return true;
      const meta = getActivityMeta(activity.details);
      return meta.type === categoryFilter.toLowerCase();
    });
  }, [activities, search, categoryFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Page Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ActivityIcon size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Activity Logs
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Audit timeline of all actions, updates, and business events
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchActivities}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/[0.07] text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
              title="Refresh logs"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() =>
                exportToExcel(
                  activities.map((a) => ({
                    ID: a.id,
                    Activity: a.details,
                    Date: new Date(a.createdAt).toLocaleDateString(),
                    Time: new Date(a.createdAt).toLocaleTimeString(),
                  })),
                  "Activity_Logs"
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-500/25 transition-all duration-200"
            >
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* ── Stat Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Logs",
              value: stats.total,
              icon: ActivityIcon,
              bg: "bg-indigo-500/10",
              text: "text-indigo-400",
              accent: "from-indigo-500 to-violet-600",
            },
            {
              label: "Today's Events",
              value: stats.today,
              icon: Clock,
              bg: "bg-blue-500/10",
              text: "text-blue-400",
              accent: "from-blue-500 to-indigo-600",
            },
            {
              label: "Last 7 Days",
              value: stats.week,
              icon: Calendar,
              bg: "bg-purple-500/10",
              text: "text-purple-400",
              accent: "from-purple-500 to-pink-600",
            },
            {
              label: "Creations & Additions",
              value: stats.created,
              icon: TrendingUp,
              bg: "bg-emerald-500/10",
              text: "text-emerald-400",
              accent: "from-emerald-500 to-teal-600",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}
                  >
                    <Icon size={17} className={s.text} />
                  </div>
                  <Zap size={13} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Search + Category Filters ───────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search activities by description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl py-3 pl-10 pr-9 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 shadow-sm transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-1.5 shadow-sm overflow-x-auto">
            {[
              { key: "ALL", label: "All" },
              { key: "CREATED", label: "Created" },
              { key: "UPDATED", label: "Updated" },
              { key: "DELETED", label: "Deleted" },
              { key: "PAYMENT", label: "Payments" },
              { key: "EMAIL", label: "Emails" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  categoryFilter === cat.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {(search || categoryFilter !== "ALL") && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <Filter size={13} className="text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">
                {filteredActivities.length} found
              </span>
            </div>
          )}
        </div>

        {/* ── Timeline Container ─────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden p-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
                <ActivityIcon
                  size={36}
                  className="text-gray-300 dark:text-slate-600"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {search || categoryFilter !== "ALL"
                  ? "No matching activities"
                  : "No activity recorded yet"}
              </h3>
              <p className="text-gray-500 text-sm">
                {search || categoryFilter !== "ALL"
                  ? "Try clearing your search or selecting a different category filter."
                  : "Recent system events and actions will automatically appear here."}
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100 dark:before:bg-white/[0.06]">
              {filteredActivities.map((activity) => {
                const meta = getActivityMeta(activity.details);
                const Icon = meta.icon;
                const timeAgoStr = formatTimeAgo(activity.createdAt);
                const dateObj = new Date(activity.createdAt);

                return (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Icon Badge / Timeline Dot */}
                    <div
                      className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 z-10 border border-white dark:border-[#161b28] shadow-sm group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon size={18} className={meta.text} />
                    </div>

                    {/* Content Box */}
                    <div className="flex-1 bg-slate-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] rounded-2xl p-4 hover:border-indigo-200 dark:hover:border-white/[0.1] transition-all duration-200">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${meta.badge}`}
                        >
                          {meta.label}
                        </span>

                        <span
                          className="text-xs text-gray-400 font-medium"
                          title={dateObj.toLocaleString()}
                        >
                          {timeAgoStr}
                        </span>
                      </div>

                      <p className="font-semibold text-gray-800 text-sm leading-snug">
                        {activity.details}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                        <Clock size={12} />
                        <span>
                          {dateObj.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {dateObj.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}