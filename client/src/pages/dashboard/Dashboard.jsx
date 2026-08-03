import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

import { getDashboardStats } from "../../api/dashboardApi";
import { getActivities } from "../../api/activityApi";
import { getClients } from "../../api/clientApi";
import { getProjects } from "../../api/projectApi";

import DashboardChart from "../../components/dashboard/DashboardChart";
import StatCard from "../../components/ui/StatCard";

import AIInsights from "../../components/dashboard/AIInsights";
import AIAssistant from "../../components/dashboard/AIAssistant";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import {
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  Users,
  UserPlus,
  FolderPlus,
  ReceiptText,
  FolderKanban,
  IndianRupee,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  const [rawStats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalInvoices: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    overdueInvoices: 0,
    clientRevenueShares: [],
  });

  const [activities, setActivities] = useState([]);
  const [targetRevenue, setTargetRevenue] = useState(150000);
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_dashboard_tasks");
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "Send Stark invoice report", completed: false },
        { id: 2, text: "Review Batcave wireframes with Bruce", completed: true },
        { id: 3, text: "Update profile hourly rate settings", completed: false },
      ];
    } catch (e) {
      return [];
    }
  });
  const [taskText, setTaskText] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const newTask = { id: Date.now(), text: taskText.trim(), completed: false };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem("ff_dashboard_tasks", JSON.stringify(updated));
    setTaskText("");
  };

  const handleToggleTask = (id) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    localStorage.setItem("ff_dashboard_tasks", JSON.stringify(updated));
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("ff_dashboard_tasks", JSON.stringify(updated));
  };

  const { user } = useAuth();

  const [chartTab, setChartTab] = useState("overview");
  const [rawProjects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [calcIncome, setCalcIncome] = useState(100000);
  const [calcHours, setCalcHours] = useState(30);
  const [calcExpenses, setCalcExpenses] = useState(15000);
  const [scratchNotes, setScratchNotes] = useState(() => localStorage.getItem("ff_scratch_notes") || "");
  const [scratchClient, setScratchClient] = useState("");

  const [clientFilter, setClientFilter] = useState(() => localStorage.getItem("ff_active_client_filter") || "all");

  useEffect(() => {
    const handleFilterChange = () => {
      setClientFilter(localStorage.getItem("ff_active_client_filter") || "all");
    };
    window.addEventListener("clientFilterChanged", handleFilterChange);
    return () => window.removeEventListener("clientFilterChanged", handleFilterChange);
  }, []);

  const isAllClients = useMemo(() => {
    if (!clientFilter) return true;
    const lower = String(clientFilter).trim().toLowerCase();
    return lower === "all" || lower.includes("all client");
  }, [clientFilter]);

  const displayStats = useMemo(() => {
    if (isAllClients) return rawStats;
    const selectedClient = clients.find(
      (c) =>
        c.id === clientFilter ||
        c.name?.toLowerCase() === clientFilter.toLowerCase() ||
        c.company?.toLowerCase() === clientFilter.toLowerCase()
    );
    if (!selectedClient) return rawStats;

    const clientProjects = rawProjects.filter((p) => p.clientId === selectedClient.id);
    const clientCompleted = clientProjects.filter((p) => p.status === "COMPLETED");

    return {
      ...rawStats,
      totalClients: 1,
      totalProjects: clientProjects.length,
      completedProjects: clientCompleted.length,
      clientRevenueShares: Array.isArray(rawStats.clientRevenueShares)
        ? rawStats.clientRevenueShares.filter(
            (s) => s.name?.toLowerCase() === (selectedClient.company || selectedClient.name)?.toLowerCase()
          )
        : [],
    };
  }, [isAllClients, clientFilter, clients, rawProjects, rawStats]);

  const stats = useMemo(() => {
    const s = displayStats || rawStats || {};
    return {
      totalClients: Number(s.totalClients ?? rawStats.totalClients) || 0,
      totalProjects: Number(s.totalProjects ?? rawStats.totalProjects) || 0,
      completedProjects: Number(s.completedProjects ?? rawStats.completedProjects) || 0,
      totalInvoices: Number(s.totalInvoices ?? rawStats.totalInvoices) || 0,
      paidRevenue: Number(s.paidRevenue ?? rawStats.paidRevenue) || 0,
      pendingRevenue: Number(s.pendingRevenue ?? rawStats.pendingRevenue) || 0,
      overdueInvoices: Number(s.overdueInvoices ?? rawStats.overdueInvoices) || 0,
      clientRevenueShares: Array.isArray(s.clientRevenueShares) ? s.clientRevenueShares : [],
    };
  }, [displayStats, rawStats]);

  const displayedProjects = useMemo(() => {
    if (isAllClients) return rawProjects;
    const selectedClient = clients.find(
      (c) =>
        c.id === clientFilter ||
        c.name?.toLowerCase() === clientFilter.toLowerCase() ||
        c.company?.toLowerCase() === clientFilter.toLowerCase()
    );
    if (!selectedClient) return rawProjects;
    return rawProjects.filter((p) => p.clientId === selectedClient.id);
  }, [isAllClients, clientFilter, clients, rawProjects]);

  const projects = displayedProjects || rawProjects;

  const COLORS = ["#2563eb", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899"];

  const completionRate =
    stats.totalProjects > 0
      ? Math.round(
        (
          stats.completedProjects /
          stats.totalProjects
        ) * 100
      ) : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData, clientsData, projectsData] = await Promise.all([
          getDashboardStats().catch(() => null),
          getActivities().catch(() => null),
          getClients().catch(() => null),
          getProjects().catch(() => null),
        ]);

        if (statsData) setStats(statsData);

        if (activityData) {
          const actList = Array.isArray(activityData) ? activityData : activityData?.activities || [];
          setActivities(actList);
        }

        if (clientsData && Array.isArray(clientsData)) {
          setClients(clientsData);
          if (clientsData.length > 0) {
            setScratchClient(clientsData[0].company || clientsData[0].name);
          }
        }

        if (projectsData && Array.isArray(projectsData)) {
          setProjects(projectsData);
        }
      } catch (error) {
        console.log("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const getActivityIcon = (text) => {

    const value = text.toLowerCase();

    if (value.includes("created"))
      return <PlusCircle size={20} />;

    if (value.includes("updated"))
      return <Pencil size={20} />;

    if(value.includes("deleted"))
      return <Trash2 size={20} />;

    if(value.includes("email"))
      return <Mail size={20} />;

    if(value.includes("invoice"))
      return <ReceiptText size={20} />

    if(value.includes("project"))
      return <FolderKanban size={20} />

    return <Clock3 size={20} />
  };


  
  return (
    <DashboardLayout>

      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {user?.role === "DEMO" ? "✨ Demo Session" : "💼 Freelancer Portal"}
            </span>
            <h1 className="text-4xl font-extrabold mt-3 tracking-tight">
              Welcome Back, {user?.name} 👋
            </h1>
            <p className="text-blue-100 mt-2 font-medium">
              Here is your freelance business performance overview today.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner">
            <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Success Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold tracking-tight">
                {stats.totalProjects === 0 ? "0%" : `${completionRate}%`}
              </span>
              <span className="text-xs text-blue-200 font-semibold">Rate</span>
            </div>
            <div className="w-36 bg-white/20 rounded-full h-1.5 mt-3">
              <div 
                className="bg-green-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {stats.totalClients === 0 && stats.totalProjects === 0 && (
        <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow transition">
          <p className="text-blue-700 font-medium flex items-center gap-2">
            🚀 Start by adding your first client and project under their respective tabs!
          </p>
        </div>
      )}

      {/* Stats Cards */}

      <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-8 ">
        <div >
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={<Users size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={<FolderKanban size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Paid Revenue"
            value={`₹${stats.paidRevenue?.toLocaleString()}`}
            icon={<IndianRupee size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Pending Revenue"
            value={`₹${stats.pendingRevenue?.toLocaleString()}`}
            icon={<Clock3 size={28} />}
          />
        </div>

        <div >
          <StatCard
            title="Completed"
            value={stats.completedProjects}
            icon={<CheckCircle2 size={28} />}
          />
        </div>
        
        <div >
          <StatCard
            title="Overdue"
            value={stats.overdueInvoices}
           icon={<AlertTriangle size={28} />}
          />
        </div>
        
        <div >
          <StatCard
            title="Success Rate"
            value={`${completionRate}%`}
            icon={<CheckCircle2 size={28} />}
          />
        </div>
      </div>

      {/* Chart + Quick Actions */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
        mb-8
      "
      >
        {/* Chart */}
        <div
          className="
          lg:col-span-2
          bg-white/70
          backdrop-blur-md
          rounded-3xl
          border
          border-white/40
          shadow-[0_8px_30px_rgb(0,0,0,0.02)]
          p-6
          hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)]
          transition-all
          duration-300
        "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {chartTab === "overview" ? "Business Overview" : "Revenue Share"}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">
                {chartTab === "overview" ? "Clients, Projects and Invoice Analytics" : "Revenue Share by Client"}
              </p>
            </div>
            
            <div className="flex gap-2 items-center">
              <button
                onClick={() => window.print()}
                className="no-print bg-slate-100/80 hover:bg-slate-200 text-[10px] text-gray-600 font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm"
                title="Export summary report"
              >
                📄 Export
              </button>

              <div className="flex bg-gray-100/80 p-1 rounded-xl">
                <button 
                  onClick={() => setChartTab("overview")}
                  className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg transition-all ${chartTab === "overview" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setChartTab("shares")}
                  className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg transition-all ${chartTab === "shares" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {chartTab === "overview" ? (
              <DashboardChart stats={stats} />
            ) : !stats.clientRevenueShares || stats.clientRevenueShares.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-gray-400 italic text-sm">
                <span>No revenue shares metrics available.</span>
                <span className="text-xs mt-1 not-italic font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Paid Invoices required</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.clientRevenueShares}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.clientRevenueShares.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="
          bg-white/70
          backdrop-blur-md
          rounded-3xl
          border
          border-white/40
          shadow-[0_8px_30px_rgb(0,0,0,0.02)]
          p-6
          flex
          flex-col
          justify-between
          hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)]
          transition-all
          duration-300
        "
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Quick Actions
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">
              Accelerate Operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <button onClick={() => navigate("/clients")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
              flex
              items-center
              gap-3
              shadow-lg
              shadow-blue-500/10
              hover:shadow-xl
              hover:shadow-blue-500/25
              hover:-translate-y-0.5
              active:scale-95
              transition-all
              duration-300
            "
            >
              <UserPlus size={22} className="shrink-0" />
              <span className="font-bold tracking-tight">Add Client</span>
            </button>

            <button onClick={() => navigate("/projects")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              text-white
              flex
              items-center
              gap-3
              shadow-lg
              shadow-indigo-500/10
              hover:shadow-xl
              hover:shadow-indigo-500/25
              hover:-translate-y-0.5
              active:scale-95
              transition-all
              duration-300
            "
            >
              <FolderPlus size={22} className="shrink-0" />
              <span className="font-bold tracking-tight">Add Project</span>
            </button>

            <button onClick={() => navigate("/invoices")}
              className="
              py-4
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-pink-600
              text-white
              flex
              items-center
              gap-3
              shadow-lg
              shadow-purple-500/10
              hover:shadow-xl
              hover:shadow-purple-500/25
              hover:-translate-y-0.5
              active:scale-95
              transition-all
              duration-300
            "
            >
              <ReceiptText size={22} className="shrink-0" />
              <span className="font-bold tracking-tight">Create Invoice</span>
            </button>
          </div>
        </div>
      </div>
      {/* AI Insights & Earnings Planner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <AIInsights stats={stats} />
        </div>
        
        {/* Interactive Earnings & Tax Estimator */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)] transition-all duration-300">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-800">
              Earnings & Tax Planner
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Interactive Cash Flow Estimator
            </p>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-500">Monthly Revenue Goal:</span>
                <span className="text-lg font-extrabold text-blue-600">₹{targetRevenue.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="20000" 
                max="500000" 
                step="5000" 
                value={targetRevenue} 
                onChange={(e) => setTargetRevenue(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-red-50/50 border border-red-100/50 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimated Tax (15%)</p>
                <p className="text-xl font-extrabold text-red-600 mt-1">₹{Math.round(targetRevenue * 0.15).toLocaleString()}</p>
              </div>
              
              <div className="bg-green-50/50 border border-green-100/50 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Take-Home Cash</p>
                <p className="text-xl font-extrabold text-green-600 mt-1">₹{Math.round(targetRevenue * 0.85).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              <span>Goal Progress (Current vs Goal)</span>
              <span>{Math.min(Math.round(((stats.paidRevenue || 0) / targetRevenue) * 100), 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.round(((stats.paidRevenue || 0) / targetRevenue) * 100), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-3 font-medium">
              You've collected ₹{(stats.paidRevenue || 0).toLocaleString()} of your ₹{targetRevenue.toLocaleString()} monthly goal.
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline & Task Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity Timeline */}
        <div
          className="
          bg-white/70
          backdrop-blur-md
          rounded-3xl
          shadow-[0_8px_30px_rgb(0,0,0,0.02)]
          border
          border-white/40
          p-8
        "
        >
          <div
            className="
            flex
            items-center
            justify-between
            mb-8
          "
          >
            <h2 className="text-xl font-bold tracking-tight text-gray-800">
              Activity Timeline
            </h2>

            <button onClick={() => 
              navigate("/activity")
            }
             className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition">
              View Full Log →
             </button>
          </div>

          {!Array.isArray(activities) || activities.length === 0 ? (
            <div className="py-12 text-center">
               <div className="text-4xl mb-3">
                📋
               </div>

               <h3 className="font-semibold text-lg text-gray-700">
                 No Activity Yet
               </h3>

               <p className="text-gray-400 text-sm mt-2">
                 Your recent actions will appear here.
               </p>
               </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
              {(Array.isArray(activities) ? activities : [])
                .slice(0, 5)
                .map((activity) => {
                  const text = (activity?.details || "").toLowerCase();
                  let pulseColor = "bg-blue-500 shadow-blue-500/20";
                  if (text.includes("created")) pulseColor = "bg-green-500 shadow-green-500/20";
                  if (text.includes("deleted")) pulseColor = "bg-red-500 shadow-red-500/20";
                  if (text.includes("paid")) pulseColor = "bg-emerald-500 shadow-emerald-500/20";
                  
                  return (
                    <div key={activity.id} className="relative group">
                      <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full ${pulseColor} shadow-[0_0_8px_4px] ring-4 ring-white transition-all group-hover:scale-125`} />
                      
                      <div className="bg-white/40 hover:bg-white/95 border border-white/20 hover:border-blue-100 p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.04)] transition-all duration-300">
                        <p className="font-semibold text-gray-800 text-sm md:text-base tracking-tight leading-relaxed">
                          {activity.details}
                        </p>

                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          {new Date(activity.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Quick Tasks To-Do Widget */}
        <div
          className="
          bg-white/70
          backdrop-blur-md
          rounded-3xl
          shadow-[0_8px_30px_rgb(0,0,0,0.02)]
          border
          border-white/40
          p-8
          flex
          flex-col
          justify-between
          hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)]
          transition-all
          duration-300
        "
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  Quick To-Dos
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                  Private Workspace Checklist
                </p>
              </div>
              <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">
                {tasks.filter(t => !t.completed).length} Pending
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Add a fast task..." 
                value={taskText} 
                onChange={(e) => setTaskText(e.target.value)}
                className="flex-1 bg-white/50 border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 font-bold text-lg active:scale-95 transition-all shadow-md shadow-blue-500/10"
              >
                +
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-6">All tasks completed! Nice job. 🎉</p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between gap-3 p-3.5 bg-white/40 rounded-xl border border-white/20 hover:border-blue-50 transition"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleToggleTask(task.id)}
                        className="h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-sm font-medium transition-all ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {task.text}
                      </span>
                    </label>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 transition text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100 font-medium">
            💡 Local storage active. Tasks persist in this browser.
          </div>
        </div>
      </div>

      {/* 3-Column Advanced Features Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8 mb-8">
        
        {/* Card 1: Urgent Deadlines */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)] transition-all duration-300">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-800">
              ⏳ Urgent Deadlines
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Upcoming Project Timelines
            </p>
            
            <div className="mt-5 space-y-3">
              {projects.filter(p => p.status !== "COMPLETED").length === 0 ? (
                <p className="text-xs text-gray-400 italic py-6 text-center">No active project deadlines.</p>
              ) : (
                [...projects]
                  .filter(p => p.status !== "COMPLETED")
                  .sort((a,b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 3)
                  .map(p => {
                    const diff = new Date(p.deadline) - new Date();
                    let infoText = "";
                    let infoBg = "";
                    if (diff <= 0) {
                      infoText = "Overdue ⚠️";
                      infoBg = "bg-red-50 text-red-700 border-red-100";
                    } else {
                      const days = Math.floor(diff / 86400000);
                      if (days === 0) {
                        infoText = "Due Today 🚨";
                        infoBg = "bg-orange-50 text-orange-700 border-orange-100 animate-pulse";
                      } else if (days < 7) {
                        infoText = `${days}d remaining 🚨`;
                        infoBg = "bg-amber-50 text-amber-700 border-amber-100";
                      } else {
                        infoText = `${days}d left`;
                        infoBg = "bg-blue-50 text-blue-700 border-blue-100";
                      }
                    }
                    return (
                      <div key={p.id} className="p-3 bg-white/40 border border-white/10 rounded-2xl flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate">Progress: {p.progress}%</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${infoBg}`}>
                          {infoText}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
          <div className="text-[10px] text-gray-400 mt-5 pt-3 border-t border-gray-100 font-medium uppercase tracking-wider">
            Urgency heatmap calculated in real-time
          </div>
        </div>

        {/* Card 2: Client Scratchpad */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-gray-800">
                📝 Notes Scratchpad
              </h3>
              <span className="text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Autosaved
              </span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Quick Client Contract Drafts
            </p>
            
            <div className="flex gap-1.5 mt-4">
              <button 
                onClick={() => {
                  setScratchNotes("Scope of Work:\n- Objective:\n- Deliverables:\n- Timeline:\n- Fee: ");
                  localStorage.setItem("ff_scratch_notes", "Scope of Work:\n- Objective:\n- Deliverables:\n- Timeline:\n- Fee: ");
                }}
                className="text-[9px] font-extrabold uppercase tracking-wider bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 rounded-lg px-2 py-1 transition-all"
              >
                Scope
              </button>
              <button 
                onClick={() => {
                  setScratchNotes("Dear [Client],\nThank you for working with me! Please review Invoice details below.\nAmount: \nDue Date: ");
                  localStorage.setItem("ff_scratch_notes", "Dear [Client],\nThank you for working with me! Please review Invoice details below.\nAmount: \nDue Date: ");
                }}
                className="text-[9px] font-extrabold uppercase tracking-wider bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 rounded-lg px-2 py-1 transition-all"
              >
                Invoice
              </button>
              <button 
                onClick={() => {
                  setScratchNotes("Hi [Client],\nJust a friendly reminder that Invoice is due on [Date]. Please process at your earliest convenience.");
                  localStorage.setItem("ff_scratch_notes", "Hi [Client],\nJust a friendly reminder that Invoice is due on [Date]. Please process at your earliest convenience.");
                }}
                className="text-[9px] font-extrabold uppercase tracking-wider bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 rounded-lg px-2 py-1 transition-all"
              >
                Reminder
              </button>
            </div>

            <textarea 
              rows={4}
              value={scratchNotes}
              onChange={(e) => {
                setScratchNotes(e.target.value);
                localStorage.setItem("ff_scratch_notes", e.target.value);
              }}
              placeholder="Start drafting contracts or scope details..."
              className="w-full mt-4 bg-white/50 border border-gray-200 focus:border-blue-500 rounded-2xl p-3 text-xs outline-none resize-none transition-all"
            />
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(scratchNotes);
              toast.success("Copied to clipboard!");
            }}
            className="text-[10px] text-blue-600 hover:text-blue-700 font-extrabold uppercase tracking-wider mt-4 pt-3 border-t border-gray-100 text-left transition"
          >
            📋 Copy to clipboard
          </button>
        </div>

        {/* Card 3: Hourly Billing Rate Calculator */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(59,130,246,0.04)] transition-all duration-300">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-800">
              💼 Billing Rate Estimator
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Minimum Hourly Pricing Calculator
            </p>
            
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Target Salary (Month):</span>
                  <span className="font-extrabold text-gray-800">₹{calcIncome.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="30000" 
                  max="300000" 
                  step="5000"
                  value={calcIncome}
                  onChange={(e) => setCalcIncome(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Weekly Work Hours:</span>
                  <span className="font-extrabold text-gray-800">{calcHours} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="2"
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Required Rate:</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-blue-600">₹{Math.ceil((calcIncome + calcExpenses) / (calcHours * 4))}</span>
                <span className="text-[10px] font-bold text-gray-400">/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant stats={stats} />
    </DashboardLayout>
  );
}
