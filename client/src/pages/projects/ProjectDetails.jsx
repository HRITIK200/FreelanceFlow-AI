import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProjectDetails, deleteProject } from "../../api/projectApi";
import { createInvoice, updateInvoice, deleteInvoice } from "../../api/invoiceApi";
import { downloadInvoicePDF } from "../../api/pdfApi";
import { sendInvoiceEmail } from "../../api/emailApi";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-hot-toast";
import {
  FolderKanban, IndianRupee, Clock3, CheckCircle2, Building2,
  Plus, Download, Send, Trash2, ArrowLeft, Receipt, CalendarClock
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    dueDate: "",
    notes: "",
  });

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectDetails(id);
      setProject(data);
      if (data?.budget) {
        setInvoiceData(prev => ({ ...prev, amount: data.budget }));
      }
    } catch (error) {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceData.amount || !invoiceData.dueDate) {
      toast.error("Amount and Due Date are required");
      return;
    }
    try {
      setSubmittingInvoice(true);
      await createInvoice({
        amount: Number(invoiceData.amount),
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes,
        projectId: id,
      });
      toast.success("Invoice created successfully! 🧾");
      setShowInvoiceModal(false);
      setInvoiceData({ amount: "", dueDate: "", notes: "" });
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleDownloadPDF = async (inv) => {
    try {
      const blob = await downloadInvoicePDF(inv.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.invoiceNumber}.pdf`;
      a.click();
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const handleSendEmail = async (inv) => {
    try {
      await sendInvoiceEmail(inv.id);
      toast.success("Invoice email sent!");
    } catch {
      toast.error("Failed to send email");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-[#161b28] rounded-3xl p-12 text-center border border-gray-100 dark:border-white/[0.06]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The requested project could not be found or has been deleted.</p>
          <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const inputCls = "w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Top Bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/projects")} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition">
            <Trash2 size={14} /> Delete Project
          </button>
        </div>

        {/* ── Project Hero Banner ─────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.status}
              </span>
              <h1 className="text-3xl font-extrabold mt-3 tracking-tight">{project.title}</h1>
              <p className="text-blue-100 mt-2 font-medium text-sm max-w-2xl">{project.description || "No description provided."}</p>
              {project.client && (
                <div className="flex items-center gap-2 mt-4 text-xs text-blue-200">
                  <Building2 size={14} /> Client: <span className="font-bold text-white">{project.client.name}</span> ({project.client.company || "Independent"})
                </div>
              )}
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-sm shadow-lg transition active:scale-95 shrink-0"
            >
              <Plus size={18} /> Create Invoice
            </button>
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Budget</p>
            <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{(project.budget || 0).toLocaleString()}</h2>
          </div>

          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{project.status}</h2>
          </div>

          <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-gray-500 uppercase">Progress</p>
            <h2 className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">{project.progress || 0}%</h2>
            <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden mt-3">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500" style={{ width: `${project.progress || 0}%` }} />
            </div>
          </div>
        </div>

        {/* ── Project Invoices ────────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/[0.06] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Receipt size={18} className="text-blue-500" /> Invoices ({project.invoices?.length || 0})
            </h2>
            <button onClick={() => setShowInvoiceModal(true)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Plus size={14} /> New Invoice
            </button>
          </div>

          {!project.invoices || project.invoices.length === 0 ? (
            <p className="text-gray-400 italic text-sm py-4">No invoices created for this project yet.</p>
          ) : (
            <div className="space-y-3">
              {project.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e2433] rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {new Date(inv.dueDate).toLocaleDateString()} · <span className={`font-bold ${inv.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>{inv.status}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{inv.amount.toLocaleString()}
                    </span>
                    <button onClick={() => handleDownloadPDF(inv)} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition" title="Download PDF">
                      <Download size={14} />
                    </button>
                    <button onClick={() => handleSendEmail(inv)} className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition" title="Send Email">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Invoice Modal ─────────────────────────────────── */}
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="Create Invoice for Project">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>Invoice Amount (₹) *</label>
            <input type="number" placeholder="50000" value={invoiceData.amount} onChange={e => setInvoiceData({ ...invoiceData, amount: e.target.value })} className={inputCls} required />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Due Date *</label>
            <input type="date" value={invoiceData.dueDate} onChange={e => setInvoiceData({ ...invoiceData, dueDate: e.target.value })} className={inputCls} required />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Notes</label>
            <textarea placeholder="Payment terms or notes..." rows={2} value={invoiceData.notes} onChange={e => setInvoiceData({ ...invoiceData, notes: e.target.value })} className={inputCls} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submittingInvoice} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50">
              {submittingInvoice ? "Creating..." : "Create Invoice"}
            </button>
            <button type="button" onClick={() => setShowInvoiceModal(false)} className="flex-1 bg-gray-100 dark:bg-[#1e2433] text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteProject} title="Delete Project" message={`Are you sure you want to delete "${project.title}"?`} />
    </DashboardLayout>
  );
}