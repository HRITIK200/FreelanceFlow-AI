import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from "../../api/invoiceApi";
import { downloadInvoicePDF } from "../../api/pdfApi";
import { sendInvoiceEmail } from "../../api/emailApi";
import { getProjects } from "../../api/projectApi";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { exportToExcel } from "../../utils/exportToExcel";
import Skeleton from "../../components/ui/Skeleton";

import {
  CheckCircle2, Download, Mail, Trash2, FileText, Clock3,
  IndianRupee, Search, X, Plus, RefreshCw, Filter,
  TrendingUp, AlertTriangle, Wallet, BarChart2, Send,
  CalendarClock, ArrowUpRight, ShieldCheck,
} from "lucide-react";

/* ─── helpers ──────────────────────────────────────────────── */
const inputCls = "w-full bg-slate-50 dark:bg-[#1e2433] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition";
const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

const isOverdue = (inv) =>
  inv.status === "PENDING" && new Date(inv.dueDate) < new Date();

const dueDays = (dueDate) => {
  if (!dueDate) return null;
  const diff = Math.ceil((new Date(dueDate) - new Date()) / 86400000);
  return diff;
};

export default function Invoices() {
  const [invoices, setInvoices]     = useState([]);
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingId, setSendingId]   = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const [formData, setFormData] = useState({
    amount: "", dueDate: "", notes: "", projectId: "",
  });

  const [isDeleteOpen, setIsDeleteOpen]   = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ── Fetch & Refresh ────────────────────────────────────── */
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const [inv, proj] = await Promise.all([getInvoices(), getProjects()]);
      setInvoices(inv);
      setProjects(proj);
      toast.success("Invoices & Projects refreshed! 🔄");
    } catch (error) {
      toast.error("Failed to refresh invoice data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch invoices");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [inv, proj] = await Promise.all([getInvoices(), getProjects()]);
        setInvoices(inv);
        setProjects(proj);
      } catch {
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Derived stats ──────────────────────────────────────── */
  const stats = useMemo(() => {
    const paid    = invoices.filter(i => i.status === "PAID");
    const pending = invoices.filter(i => i.status === "PENDING");
    const overdue = invoices.filter(isOverdue);
    const paidRev = paid.reduce((s, i) => s + (i.amount || 0), 0);
    const pendAmt = pending.reduce((s, i) => s + (i.amount || 0), 0);
    const total   = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const collRate = invoices.length > 0 ? Math.round((paid.length / invoices.length) * 100) : 0;
    const avgAmt  = invoices.length > 0 ? Math.round(total / invoices.length) : 0;
    return { paid: paid.length, pending: pending.length, overdue: overdue.length, paidRev, pendAmt, total, collRate, avgAmt };
  }, [invoices]);

  /* ── Filtered ───────────────────────────────────────────── */
  const filtered = useMemo(() =>
    invoices.filter(inv => {
      const q = search.toLowerCase();
      const matchSearch =
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.project?.title?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "ALL" ? true :
        statusFilter === "OVERDUE" ? isOverdue(inv) :
        inv.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [invoices, search, statusFilter]
  );

  /* ── Create invoice ─────────────────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.dueDate) { toast.error("Amount and due date are required"); return; }
    try {
      setSubmitting(true);
      await createInvoice({ ...formData, amount: Number(formData.amount) });
      toast.success("Invoice created! 🧾");
      setFormData({ amount: "", dueDate: "", notes: "", projectId: "" });
      setShowModal(false);
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Toggle paid/pending ────────────────────────────────── */
  const handleToggleStatus = async (invoice) => {
    const newStatus = invoice.status === "PAID" ? "PENDING" : "PAID";
    try {
      await updateInvoice(invoice.id, { status: newStatus });
      toast.success(`Marked as ${newStatus === "PAID" ? "Paid ✅" : "Pending ⏳"}`);
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  /* ── Download PDF ───────────────────────────────────────── */
  const handleDownload = async (invoice) => {
    try {
      setDownloadingId(invoice.id);
      const blob = await downloadInvoicePDF(invoice.id);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `Invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  /* ── Send email ─────────────────────────────────────────── */
  const handleEmail = async (invoice) => {
    try {
      setSendingId(invoice.id);
      await sendInvoiceEmail(invoice.id);
      toast.success("Invoice emailed successfully! 📧");
      fetchInvoices();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSendingId(null);
    }
  };

  /* ── Health label ───────────────────────────────────────── */
  const healthLabel = stats.collRate >= 80 ? { text: "Excellent", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" }
    : stats.collRate >= 50 ? { text: "Good",      color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10" }
    : { text: "Needs Work",  color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-500/10" };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Invoices</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">Track billing, payments, and revenue collection</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/[0.07] text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all disabled:opacity-50"
              title="Refresh invoices"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin text-emerald-600" : ""} />
            </button>
            <button
              onClick={() => exportToExcel(invoices.map(i => ({ InvoiceNo: i.invoiceNumber, Project: i.project?.title, Amount: i.amount, Status: i.status, DueDate: new Date(i.dueDate).toLocaleDateString() })), "Invoices")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold shadow-md shadow-emerald-500/25 transition-all"
            >
              <Plus size={15} /> Create Invoice
            </button>
          </div>
        </div>

        {/* ── Top stat cards (4) ──────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Invoices", value: invoices.length, icon: FileText,    bg: "bg-blue-500/10",    text: "text-blue-400",    sub: "All time" },
            { label: "Paid",           value: stats.paid,      icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-400", sub: `₹${stats.paidRev.toLocaleString()} collected` },
            { label: "Pending",        value: stats.pending,   icon: Clock3,       bg: "bg-amber-500/10",   text: "text-amber-400",   sub: `₹${stats.pendAmt.toLocaleString()} outstanding` },
            { label: "Overdue",        value: stats.overdue,   icon: AlertTriangle,bg: "bg-red-500/10",     text: "text-red-400",     sub: stats.overdue > 0 ? "Action needed" : "All good" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/70 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/[0.06] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={17} className={s.text} />
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Insight cards row ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Avg Invoice */}
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={15} className="text-blue-500" />
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Avg Invoice</p>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{stats.avgAmt.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500 mt-1">per invoice across all time</p>
          </div>

          {/* Collection Rate */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Collection Rate</p>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.collRate}%</p>
            <div className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700" style={{ width: `${stats.collRate}%` }} />
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={15} className="text-amber-500" />
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Outstanding</p>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{stats.pendAmt.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500 mt-1">{stats.pending} pending invoices</p>
          </div>

          {/* Health */}
          <div className={`${healthLabel.bg} rounded-2xl border border-current/10 p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={15} className={healthLabel.color} />
              <p className={`text-xs font-semibold ${healthLabel.color} uppercase tracking-wider`}>Invoice Health</p>
            </div>
            <p className={`text-2xl font-extrabold ${healthLabel.color}`}>{healthLabel.text}</p>
            <p className="text-[11px] text-gray-500 mt-1">{stats.collRate}% collection rate</p>
          </div>
        </div>

        {/* ── Toolbar: search + filter pills ──────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by invoice no. or project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl py-3 pl-10 pr-9 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 shadow-sm transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-[#161b28] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-1.5 shadow-sm flex-wrap">
            {[
              { key: "ALL",     label: "All" },
              { key: "PAID",    label: "Paid" },
              { key: "PENDING", label: "Pending" },
              { key: "OVERDUE", label: "Overdue" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  statusFilter === f.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {f.label}
                {f.key === "OVERDUE" && stats.overdue > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                    {stats.overdue}
                  </span>
                )}
              </button>
            ))}
          </div>

          {(search || statusFilter !== "ALL") && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <Filter size={13} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">{filtered.length} found</span>
            </div>
          )}
        </div>

        {/* ── Main table card ──────────────────────────────── */}
        <div className="bg-white/80 dark:bg-[#161b28] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32 rounded-xl" />
                </div>
              ))}
            </div>

          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
                <FileText size={36} className="text-gray-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {search || statusFilter !== "ALL" ? "No invoices found" : "No invoices yet"}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {search || statusFilter !== "ALL" ? "Try adjusting your search or filter." : "Create your first invoice to start tracking payments."}
              </p>
              {!search && statusFilter === "ALL" && (
                <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all">
                  <Plus size={16} /> Create First Invoice
                </button>
              )}
            </div>

          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#1e2433] border-b border-gray-100 dark:border-white/[0.06]">
                      {["Invoice No", "Project", "Amount", "Status", "Due Date", "Actions"].map(h => (
                        <th key={h} className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                    {filtered.map(inv => {
                      const overdue = isOverdue(inv);
                      const days    = dueDays(inv.dueDate);
                      return (
                        <tr key={inv.id} className={`hover:bg-emerald-50/20 dark:hover:bg-white/[0.02] transition-colors group ${overdue ? "bg-red-50/30 dark:bg-red-500/5" : ""}`}>
                          {/* Invoice number */}
                          <td className="p-4 pl-5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                <FileText size={13} className="text-white" />
                              </div>
                              <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{inv.invoiceNumber}</span>
                            </div>
                          </td>
                          {/* Project */}
                          <td className="p-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[160px] block">
                              {inv.project?.title || <span className="italic text-gray-400">No project</span>}
                            </span>
                          </td>
                          {/* Amount */}
                          <td className="p-4">
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">₹{(inv.amount || 0).toLocaleString()}</span>
                          </td>
                          {/* Status */}
                          <td className="p-4">
                            {overdue ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                                <AlertTriangle size={10} /> Overdue
                              </span>
                            ) : inv.status === "PAID" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                              </span>
                            )}
                          </td>
                          {/* Due date */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarClock size={13} className={overdue ? "text-red-400" : "text-gray-400"} />
                              <span className={`text-xs font-medium ${overdue ? "text-red-500" : days !== null && days <= 3 ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`}>
                                {new Date(inv.dueDate).toLocaleDateString()}
                                {days !== null && days <= 3 && !overdue && ` (${days}d)`}
                              </span>
                            </div>
                          </td>
                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {/* Toggle status */}
                              <button
                                onClick={() => handleToggleStatus(inv)}
                                title={inv.status === "PAID" ? "Mark Pending" : "Mark Paid"}
                                className={`p-2 rounded-xl text-xs font-semibold transition-all ${inv.status === "PAID" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}
                              >
                                <CheckCircle2 size={15} />
                              </button>
                              {/* PDF */}
                              <button
                                onClick={() => handleDownload(inv)}
                                disabled={downloadingId === inv.id}
                                title="Download PDF"
                                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all disabled:opacity-50"
                              >
                                {downloadingId === inv.id
                                  ? <span className="w-3.5 h-3.5 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin block" />
                                  : <Download size={15} />}
                              </button>
                              {/* Email */}
                              <button
                                onClick={() => handleEmail(inv)}
                                disabled={sendingId === inv.id}
                                title="Send Email"
                                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all disabled:opacity-50"
                              >
                                {sendingId === inv.id
                                  ? <span className="w-3.5 h-3.5 border-2 border-purple-400/40 border-t-purple-500 rounded-full animate-spin block" />
                                  : <Send size={15} />}
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => { setDeleteInvoiceId(inv.id); setIsDeleteOpen(true); }}
                                title="Delete"
                                className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
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
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3 p-4">
                {filtered.map(inv => {
                  const overdue = isOverdue(inv);
                  return (
                    <div key={inv.id} className={`rounded-2xl border p-4 ${overdue ? "border-red-100 dark:border-red-500/20 bg-red-50/30 dark:bg-red-500/5" : "border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#1e2433]"}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{inv.invoiceNumber}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{inv.project?.title || "No project"}</p>
                        </div>
                        {overdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-100 dark:border-red-500/20">
                            <AlertTriangle size={9} /> Overdue
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${inv.status === "PAID" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"}`}>
                            {inv.status === "PAID" ? "✅ Paid" : "⏳ Pending"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{(inv.amount || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <CalendarClock size={12} /> {new Date(inv.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => handleToggleStatus(inv)} className="py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center justify-center"><CheckCircle2 size={14} /></button>
                        <button onClick={() => handleDownload(inv)} className="py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-semibold flex items-center justify-center"><Download size={14} /></button>
                        <button onClick={() => handleEmail(inv)} className="py-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 text-xs font-semibold flex items-center justify-center"><Mail size={14} /></button>
                        <button onClick={() => { setDeleteInvoiceId(inv.id); setIsDeleteOpen(true); }} className="py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-semibold flex items-center justify-center"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table footer */}
              <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1f2e]">
                <p className="text-xs text-gray-400">
                  Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{invoices.length}</span> invoices
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ₹{stats.paidRev.toLocaleString()} collected</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> ₹{stats.pendAmt.toLocaleString()} pending</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Summary strip ────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-[#161b28] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <BarChart2 size={15} className="text-emerald-500" /> Revenue Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Paid Revenue</p>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹{stats.paidRev.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock3 size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Pending Amount</p>
                <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">₹{stats.pendAmt.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Collection Rate</p>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{stats.collRate}%</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Create Invoice Modal ─────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161b28] rounded-3xl border border-gray-100 dark:border-white/[0.07] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <FileText size={17} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Invoice</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Amount (₹) *</label>
                  <input type="number" placeholder="e.g. 25000" value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})} className={inputCls} required />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Due Date *</label>
                  <input type="date" value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})} className={inputCls} required />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Link to Project</label>
                <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className={inputCls}>
                  <option value="">Select project (optional)</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Notes</label>
                <textarea rows={2} placeholder="Payment terms, extra notes..." value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})} className={inputCls} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
                  {submitting ? "Creating..." : "Create Invoice"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-[#1e2433] text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ─────────────────────────────────── */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={async () => {
          try {
            await deleteInvoice(deleteInvoiceId);
            toast.success("Invoice deleted successfully");
            fetchInvoices();
            setIsDeleteOpen(false);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete invoice");
          }
        }}
      />
    </DashboardLayout>
  );
}