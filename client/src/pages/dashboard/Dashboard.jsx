import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getDashboardStats } from "../../api/dashboardApi";
import { getActivities } from "../../api/activityApi";

import DashboardChart from "../../components/dashboard/DashboardChart";
import StatCard from "../../components/ui/StatCard";

import AIInsights from "../../components/dashboard/AIInsights";
import AIAssistant from "../../components/dashboard/AIAssistant";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalInvoices: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    overdueInvoices: 0,
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


        const statsData =
          await getDashboardStats();

        const activityData =
          await getActivities();

        setStats(statsData);
        setActivities(activityData);

      } catch (error) {
        console.log(error);

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
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Business Overview
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">
            Clients, Projects and Invoice Analytics
          </p>

          <div className="mt-6">
            <DashboardChart stats={stats} />
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

          {activities.length === 0 ? (
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
              {activities
                .slice(0, 5)
                .map((activity) => {
                  const text = activity.details.toLowerCase();
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

      <AIAssistant stats={stats} />
    </DashboardLayout>
  );
}
