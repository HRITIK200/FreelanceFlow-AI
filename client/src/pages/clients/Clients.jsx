import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/clientApi";
import { getProjects } from "../../api/projectApi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { exportToExcel } from "../../utils/exportToExcel";
import Skeleton from "../../components/ui/Skeleton";

import {
  Users,
  Search,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Download,
  Plus,
  X,
  LayoutGrid,
  List,
  TrendingUp,
  FolderKanban,
  ChevronRight,
  UserCheck,
  Filter,
  RefreshCw,
} from "lucide-react";

/* ── Deterministic avatar gradient per client name ─────────── */
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-violet-600",
  "from-lime-500 to-emerald-600",
];
const getGradient = (name = "") =>
  GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];

/* ── Initials helper ────────────────────────────────────────── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [submitting, setSubmitting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [deleteClientId, setDeleteClientId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ── Fetch ──────────────────────────────────────────────── */
  const fetchClients = async () => {
    try {
      setLoading(true);
      const [clientData, projectData] = await Promise.all([
        getClients(),
        getProjects().catch(() => []),
      ]);
      setClients(clientData);
      setProjects(projectData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ── Project count per client ───────────────────────────── */
  const projectCountMap = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const key = p.clientName || p.client?.name || p.company;
      if (key) map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [projects]);

  /* ── Filtered list ──────────────────────────────────────── */
  const filteredClients = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.company?.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  /* ── Stats ──────────────────────────────────────────────── */
  const stats = [
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "in-progress" || p.status === "In Progress").length,
      icon: FolderKanban,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-500/10",
      text: "text-violet-400",
    },
    {
      label: "This Month",
      value: clients.filter((c) => {
        const d = new Date(c.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
    {
      label: "With Companies",
      value: clients.filter((c) => c.company).length,
      icon: Building2,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
    },
  ];

  /* ── Submit new client ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    try {
      setSubmitting(true);
      await createClient(form);
      toast.success("Client added successfully! 🎉");
      setForm({ name: "", email: "", company: "" });
      setShowAddForm(false);
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create client");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Page header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Users size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Clients
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Manage all your client relationships and companies
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchClients}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => exportToExcel(clients, "Clients")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-500/25 transition-all duration-200"
            >
              <Download size={15} />
              Export
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/25 transition-all duration-200"
            >
              {showAddForm ? <X size={15} /> : <Plus size={15} />}
              {showAddForm ? "Cancel" : "Add Client"}
            </button>
          </div>
        </div>

        {/* ── Stat cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={17} className={s.text} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${s.text}`}>
                    Live
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Add Client Form ───────────────────────────────── */}
        {showAddForm && (
          <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] shadow-md p-6 animate-[fadeSlideIn_0.25s_ease]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserCheck size={16} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Add New Client</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. john@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="self-end bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-md shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus size={15} />
                )}
                {submitting ? "Adding..." : "Add Client"}
              </button>
            </form>
          </div>
        )}

        {/* ── Search + View toggle ──────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl py-3 pl-10 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition"
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

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={15} />
            </button>
          </div>

          {/* Filter badge */}
          {search && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <Filter size={13} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-600">{filteredClients.length} found</span>
            </div>
          )}
        </div>

        {/* ── Loading skeleton ──────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 dark:bg-[#161b28] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>

        /* ── Empty state ─────────────────────────────────── */
        ) : filteredClients.length === 0 ? (
          <div className="bg-white/70 dark:bg-[#161b28] rounded-3xl border border-gray-100 dark:border-white/[0.06] p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
              <Users size={36} className="text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {search ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "Add your first client to start managing projects and invoices."}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-200"
              >
                <Plus size={16} /> Add Your First Client
              </button>
            )}
          </div>

        /* ── Grid view ───────────────────────────────────── */
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const projCount = projectCountMap[client.company || client.name] || 0;
              return (
                <div
                  key={client.id}
                  className="group bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Card top accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${getGradient(client.name)}`} />

                  <div className="p-5">
                    {/* Avatar + name row */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradient(client.name)} flex items-center justify-center font-bold text-white text-base shadow-md shrink-0`}>
                        {getInitials(client.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/clients/${client.id}`}
                          className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-[15px] leading-tight block truncate"
                        >
                          {client.name}
                        </Link>
                        {client.company && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Building2 size={11} className="text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-500 truncate">{client.company}</span>
                          </div>
                        )}
                      </div>
                      {/* Project count badge */}
                      {projCount > 0 && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20">
                          <FolderKanban size={9} />
                          {projCount}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] mb-4">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{client.email}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/clients/${client.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      >
                        View Details <ChevronRight size={12} />
                      </Link>
                      <button
                        onClick={() => { setSelectedClient(client); setIsEditOpen(true); }}
                        className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                        title="Edit client"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => { setDeleteClientId(client.id); setIsDeleteOpen(true); }}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                        title="Delete client"
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
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Projects</th>
                  <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filteredClients.map((client) => {
                  const projCount = projectCountMap[client.company || client.name] || 0;
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-blue-50/30 dark:hover:bg-white/[0.02] transition-colors duration-150 group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(client.name)} flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0`}>
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <Link
                              to={`/clients/${client.id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
                            >
                              {client.name}
                            </Link>
                            <p className="text-[11px] text-gray-400 mt-0.5 sm:hidden">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Mail size={13} className="text-gray-400" />
                          {client.email}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {client.company ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-semibold border border-violet-100 dark:border-violet-500/20">
                            <Building2 size={10} /> {client.company}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${projCount > 0 ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-gray-50 dark:bg-white/[0.03] text-gray-400"}`}>
                          <FolderKanban size={10} /> {projCount} project{projCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/clients/${client.id}`}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            title="View details"
                          >
                            <ChevronRight size={15} />
                          </Link>
                          <button
                            onClick={() => { setSelectedClient(client); setIsEditOpen(true); }}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => { setDeleteClientId(client.id); setIsDeleteOpen(true); }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1f2e]">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{filteredClients.length}</span> of <span className="font-semibold text-gray-600">{clients.length}</span> clients
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-gray-400 font-medium">Live data</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Edit Modal ──────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Client">
        {selectedClient && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateClient(selectedClient.id, {
                  name: selectedClient.name,
                  email: selectedClient.email,
                  company: selectedClient.company,
                });
                toast.success("Client updated successfully");
                fetchClients();
                setIsEditOpen(false);
              } catch (error) {
                toast.error(error.response?.data?.message || "Failed to update client");
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={selectedClient.name}
                onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={selectedClient.email}
                onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</label>
              <input
                type="text"
                value={selectedClient.company || ""}
                onChange={(e) => setSelectedClient({ ...selectedClient, company: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 bg-gray-100 dark:bg-[#1e2433] text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={async () => {
          try {
            await deleteClient(deleteClientId);
            toast.success("Client deleted successfully");
            fetchClients();
            setIsDeleteOpen(false);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete client");
          }
        }}
      />
    </DashboardLayout>
  );
}
