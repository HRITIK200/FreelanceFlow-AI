import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getClients } from "../../api/clientApi";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projectApi";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToExcel";
import { Link } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Search,
  Pencil,
  Trash2,
  Building2,
  Download,
  Plus,
  X,
  LayoutGrid,
  List,
  Filter,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  CalendarClock,
  AlertTriangle,
  Rocket,
} from "lucide-react";

/* ── Status config ────────────────────────────────────────── */
const STATUS = {
  COMPLETED:  { label: "Completed",  icon: "✅", dot: "bg-emerald-400", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20", bar: "from-emerald-400 to-teal-500" },
  IN_PROGRESS:{ label: "In Progress",icon: "🚀", dot: "bg-blue-400",    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",       bar: "from-blue-400 to-indigo-500"  },
  PENDING:    { label: "Pending",    icon: "⏳", dot: "bg-amber-400",   badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",   bar: "from-amber-400 to-orange-500" },
};

const getStatus = (s) => STATUS[s] || STATUS.PENDING;

/* ── Deadline urgency ─────────────────────────────────────── */
const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (diff < 0)  return { text: "Overdue",      color: "text-red-500",   bg: "bg-red-50 dark:bg-red-500/10" };
  if (diff === 0) return { text: "Due today",    color: "text-orange-500",bg: "bg-orange-50 dark:bg-orange-500/10" };
  if (diff <= 3)  return { text: `${diff}d left`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" };
  return null;
};

/* ── Card gradient per index ──────────────────────────────── */
const CARD_ACCENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

const inputCls = "w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";
const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

export default function Projects() {
  const [projects, setProjects]         = useState([]);
  const [clients, setClients]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode]         = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const [formData, setFormData] = useState({
    title: "", description: "", budget: "", progress: 0,
    status: "PENDING", deadline: "", clientId: "",
  });

  const [isEditOpen, setIsEditOpen]         = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  /* ── Fetch ─────────────────────────────────────────────── */
  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch projects");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pd, cd] = await Promise.all([getProjects(), getClients()]);
        setProjects(pd);
        setClients(cd);
      } catch {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Derived stats ─────────────────────────────────────── */
  const stats = useMemo(() => ({
    total:    projects.length,
    completed: projects.filter(p => p.status === "COMPLETED").length,
    inProgress: projects.filter(p => p.status === "IN_PROGRESS").length,
    pending:  projects.filter(p => p.status === "PENDING").length,
    revenue:  projects.reduce((s, p) => s + (p.budget || 0), 0),
    avgProgress: projects.length > 0
      ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length) : 0,
  }), [projects]);

  /* ── Filtered ──────────────────────────────────────────── */
  const filtered = useMemo(() =>
    projects.filter(p => {
      const matchSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [projects, search, statusFilter]
  );

  /* ── Create project ────────────────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Project title is required"); return; }
    if (!formData.clientId) { toast.error("Please select a client"); return; }
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        budget: formData.budget !== "" ? Number(formData.budget) : 0,
        progress: Number(formData.progress) || 0,
        deadline: formData.deadline ? formData.deadline : null,
      };
      await createProject(payload);
      toast.success("Project created! 🚀");
      setFormData({ title: "", description: "", budget: "", progress: 0, status: "PENDING", deadline: "", clientId: "" });
      setShowAddModal(false);
      fetchProjects();
    } catch (error) {
      const serverMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || "Failed to create project";
      toast.error(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Update project ────────────────────────────────────── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedStatus = (selectedProject?.progress || 0) >= 100 ? "COMPLETED" : selectedProject.status;
      await updateProject(selectedProject.id, {
        title: selectedProject.title,
        description: selectedProject.description,
        budget: Number(selectedProject.budget),
        progress: Number(selectedProject.progress) || 0,
        status: updatedStatus,
        deadline: selectedProject.deadline,
        clientId: selectedProject.clientId || selectedProject.client?.id,
      });
      toast.success("Project updated successfully");
      fetchProjects();
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  const statCards = [
    { label: "Total",       value: stats.total,       icon: FolderKanban, bg: "bg-blue-500/10",    text: "text-blue-400",    accent: "from-blue-500 to-indigo-600" },
    { label: "Completed",   value: stats.completed,   icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-400", accent: "from-emerald-500 to-teal-600" },
    { label: "In Progress", value: stats.inProgress,  icon: Rocket,       bg: "bg-violet-500/10",  text: "text-violet-400",  accent: "from-violet-500 to-purple-600" },
    { label: "Pending",     value: stats.pending,     icon: Clock3,       bg: "bg-amber-500/10",   text: "text-amber-400",   accent: "from-amber-500 to-orange-600" },
    { label: "Revenue",     value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, bg: "bg-green-500/10", text: "text-green-400", accent: "from-green-500 to-emerald-600" },
    { label: "Avg Progress",value: `${stats.avgProgress}%`, icon: TrendingUp,   bg: "bg-cyan-500/10",    text: "text-cyan-400",    accent: "from-cyan-500 to-blue-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <FolderKanban size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Projects</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">Track and manage all your freelance projects</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={fetchProjects} className="p-2.5 rounded-xl border border-gray-200 dark:border-white/[0.07] text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200" title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => exportToExcel(projects.map(p => ({ Title: p.title, Status: p.status, Budget: p.budget, Client: p.client?.name, Progress: `${p.progress}%`, Deadline: p.deadline })), "Projects")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all duration-200"
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold shadow-md shadow-violet-500/25 transition-all duration-200"
            >
              <Plus size={15} /> New Project
            </button>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={15} className={s.text} />
                  </div>
                </div>
                <p className="text-xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Toolbar: search + filters + view toggle ──────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl py-3 pl-10 pr-9 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-sm transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-1.5 shadow-sm flex-wrap">
            {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {s === "ALL" ? "All" : s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-xl p-1 shadow-sm">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
              <LayoutGrid size={15} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
              <List size={15} />
            </button>
          </div>

          {(search || statusFilter !== "ALL") && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20">
              <Filter size={13} className="text-violet-500" />
              <span className="text-xs font-semibold text-violet-600">{filtered.length} found</span>
            </div>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 dark:bg-[#161b28] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex gap-2"><Skeleton className="h-7 w-20 rounded-full" /><Skeleton className="h-7 w-16 rounded-full" /></div>
              </div>
            ))}
          </div>

        /* ── Empty ───────────────────────────────────────── */
        ) : filtered.length === 0 ? (
          <div className="bg-white/70 dark:bg-[#161b28] rounded-3xl border border-gray-100 dark:border-white/[0.06] p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
              <FolderKanban size={36} className="text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{search || statusFilter !== "ALL" ? "No projects found" : "No projects yet"}</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search || statusFilter !== "ALL" ? "Try adjusting your search or filter." : "Create your first project to start tracking work."}
            </p>
            {!search && statusFilter === "ALL" && (
              <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200">
                <Plus size={16} /> Create First Project
              </button>
            )}
          </div>

        /* ── Grid view ───────────────────────────────────── */
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project, idx) => {
              const st = getStatus(project.status);
              const dl = deadlineInfo(project.deadline);
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
              const progress = project.progress || 0;

              return (
                <div key={project.id} className="group bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Top accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

                  <div className="p-5 flex-1 flex flex-col gap-3">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link to={`/projects/${project.id}`} className="font-bold text-gray-900 hover:text-violet-600 transition-colors text-[15px] leading-tight block truncate">
                          {project.title}
                        </Link>
                        {project.client?.name && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 size={11} className="text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-500 truncate">{project.client.name}</span>
                          </div>
                        )}
                      </div>
                      {/* Status badge */}
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>

                    {/* Budget + deadline row */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                        <IndianRupee size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{(project.budget || 0).toLocaleString()}</span>
                      </div>
                      {project.deadline && (
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium ${dl ? `${dl.bg} ${dl.color} border-current/20` : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 border-gray-100 dark:border-white/[0.04]"}`}>
                          {dl ? <AlertTriangle size={11} /> : <CalendarClock size={11} />}
                          {dl ? dl.text : new Date(project.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-gray-500 font-medium">Progress</span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${st.bar} transition-all duration-700`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto pt-1">
                      <Link to={`/projects/${project.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors">
                        View Details <ChevronRight size={12} />
                      </Link>
                      <button
                        onClick={() => { setSelectedProject(project); setIsEditOpen(true); }}
                        className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => { setDeleteProjectId(project.id); setIsDeleteOpen(true); }}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        /* ── List / table view ───────────────────────────── */
        ) : (
          <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#1e2433] border-b border-gray-100 dark:border-white/[0.06]">
                  {["Project", "Client", "Budget", "Status", "Progress", "Deadline", "Actions"].map(h => (
                    <th key={h} className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-5 last:text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((project) => {
                  const st = getStatus(project.status);
                  const dl = deadlineInfo(project.deadline);
                  const progress = project.progress || 0;
                  return (
                    <tr key={project.id} className="hover:bg-violet-50/20 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-5">
                        <Link to={`/projects/${project.id}`} className="font-semibold text-gray-900 hover:text-violet-600 transition-colors text-sm">
                          {project.title}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Building2 size={13} className="text-gray-400" />
                          {project.client?.name || "—"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{(project.budget || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="p-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${st.bar}`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-8 text-right">{progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {project.deadline ? (
                          <span className={`text-xs font-medium ${dl ? dl.color : "text-gray-500"}`}>
                            {dl ? dl.text : new Date(project.deadline).toLocaleDateString()}
                          </span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/projects/${project.id}`} className="p-1.5 rounded-lg text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                            <ChevronRight size={15} />
                          </Link>
                          <button onClick={() => { setSelectedProject(project); setIsEditOpen(true); }} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => { setDeleteProjectId(project.id); setIsDeleteOpen(true); }} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1f2e]">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{projects.length}</span> projects
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-gray-400 font-medium">Live data</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Create Project Modal ─────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161b28] rounded-3xl border border-gray-100 dark:border-white/[0.07] shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <FolderKanban size={17} className="text-violet-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Project</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className={labelCls}>Project Title *</label>
                <input type="text" placeholder="e.g. Website Redesign" value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} required />
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Description</label>
                <textarea placeholder="Brief project description..." rows={2} value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Budget (₹)</label>
                  <input type="number" placeholder="50000" value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Deadline</label>
                  <input type="date" value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Client</label>
                  <select value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className={inputCls}>
                    <option value="">Select client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={inputCls}>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all duration-200 flex items-center justify-center gap-2">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
                  {submitting ? "Creating..." : "Create Project"}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-[#1e2433] text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Project">
        {selectedProject && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className={labelCls}>Project Title</label>
              <input type="text" value={selectedProject.title}
                onChange={e => setSelectedProject({...selectedProject, title: e.target.value})} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Description</label>
              <textarea rows={2} value={selectedProject.description || ""}
                onChange={e => setSelectedProject({...selectedProject, description: e.target.value})} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelCls}>Budget (₹)</label>
                <input type="number" value={selectedProject.budget}
                  onChange={e => setSelectedProject({...selectedProject, budget: e.target.value})} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Deadline</label>
                <input type="date" value={selectedProject.deadline?.slice(0,10) || ""}
                  onChange={e => setSelectedProject({...selectedProject, deadline: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className={labelCls}>Progress</label>
                <span className="text-sm font-bold text-violet-600">{selectedProject.progress || 0}%</span>
              </div>
              <input type="range" min="0" max="100" value={selectedProject.progress || 0}
                onChange={e => setSelectedProject({...selectedProject, progress: Number(e.target.value)})}
                className="w-full accent-violet-600" />
              <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${selectedProject.progress || 0}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Status</label>
              <select value={selectedProject.status}
                onChange={e => setSelectedProject({...selectedProject, status: e.target.value})} className={inputCls}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditOpen(false)}
                className="flex-1 bg-gray-100 dark:bg-[#1e2433] text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Delete Modal ────────────────────────────────── */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={async () => {
          try {
            await deleteProject(deleteProjectId);
            toast.success("Project deleted successfully");
            fetchProjects();
            setIsDeleteOpen(false);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete project");
          }
        }}
      />
    </DashboardLayout>
  );
}
