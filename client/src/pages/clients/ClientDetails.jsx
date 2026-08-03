import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getClientDetails, deleteClient } from "../../api/clientApi";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-hot-toast";
import {
  Users, Building2, Mail, Phone, FolderKanban, Receipt,
  IndianRupee, ArrowLeft, Trash2, CheckCircle2, Clock3,
  ChevronRight, ExternalLink
} from "lucide-react";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await getClientDetails(id);
        setData(response);
      } catch (error) {
        toast.error("Failed to load client details");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      toast.success("Client deleted successfully");
      navigate("/clients");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete client");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !data.client) {
    return (
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-[#161b28] rounded-3xl p-12 text-center border border-gray-100 dark:border-white/[0.06]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Client Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The requested client could not be found or has been deleted.</p>
          <Link to="/clients" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm">
            <ArrowLeft size={16} /> Back to Clients
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { client, totalProjects, completedProjects, totalRevenue, pendingRevenue, paidRevenue, recentInvoices } = data;
  const initials = client.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "C";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Top Bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/clients")} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowLeft size={16} /> Back to Clients
          </button>
          <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition">
            <Trash2 size={14} /> Delete Client
          </button>
        </div>

        {/* ── Client Hero Banner ──────────────────────────────────── */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-2xl shadow-inner">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{client.name}</h1>
                <p className="text-violet-100 font-medium text-sm mt-1">{client.company || "Independent Client"}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-violet-200">
                  <span className="flex items-center gap-1.5"><Mail size={13} /> {client.email}</span>
                  {client.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {client.phone}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Projects</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalProjects}</p>
          </div>
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Completed</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedProjects}</p>
          </div>
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Budget</p>
            <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">₹{(totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Revenue</p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">₹{(pendingRevenue || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* ── Client Projects ────────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderKanban size={18} className="text-violet-500" /> Projects ({client.projects.length})
          </h2>
          {client.projects.length === 0 ? (
            <p className="text-gray-400 italic text-sm py-4">No projects created for this client yet.</p>
          ) : (
            <div className="space-y-3">
              {client.projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e2433] rounded-2xl border border-gray-100 dark:border-white/[0.04] hover:border-violet-300 transition">
                  <div>
                    <Link to={`/projects/${p.id}`} className="font-bold text-gray-900 dark:text-white text-sm hover:text-violet-600 transition flex items-center gap-1.5">
                      {p.title} <ExternalLink size={12} />
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">Status: <span className="font-semibold text-violet-600">{p.status}</span> · Progress: {p.progress}%</p>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{(p.budget || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Invoices ────────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Receipt size={18} className="text-emerald-500" /> Recent Invoices
          </h2>
          {recentInvoices.length === 0 ? (
            <p className="text-gray-400 italic text-sm py-4">No invoices issued for this client yet.</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e2433] rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Status: <span className={`font-bold ${inv.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>{inv.status}</span></p>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{inv.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Client" message={`Are you sure you want to delete ${client.name}? All associated projects and invoices will be deleted.`} />
    </DashboardLayout>
  );
}