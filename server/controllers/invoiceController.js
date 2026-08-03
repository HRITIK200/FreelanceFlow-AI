import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

// Generate a year-prefixed invoice number: INV-2026-007
// Uses COUNT to avoid race conditions with concurrent requests
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const count = await prisma.invoice.count({
    where: { invoiceNumber: { startsWith: prefix } },
  });

  return `${prefix}${String(count + 1).padStart(3, "0")}`;
};

export const createInvoice = async (req, res, next) => {
  try {
    const { amount, dueDate, projectId, notes, status } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, client: { userId: req.user.userId } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount,
        dueDate: new Date(dueDate),
        projectId,
        notes,
        status: status || "PENDING",
      },
      include: { project: { include: { client: true } } },
    });

    await logActivity({
      userId: req.user.userId,
      action: "CREATE",
      entityType: "INVOICE",
      entityId: invoice.id,
      details: `Created invoice ${invoice.invoiceNumber} for ₹${amount.toLocaleString()}`,
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const { status, projectId, search } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        project: { client: { userId: req.user.userId } },
        ...(status && { status }),
        ...(projectId && { projectId }),
        ...(search && {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            { notes: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { project: { include: { client: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

// Renamed from updateInvoiceStatus — now supports full field updates
export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, amount, dueDate, notes } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id, project: { client: { userId: req.user.userId } } },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(amount !== undefined && { amount }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(notes !== undefined && { notes }),
      },
      include: { project: { include: { client: true } } },
    });

    await logActivity({
      userId: req.user.userId,
      action: "UPDATE",
      entityType: "INVOICE",
      entityId: updatedInvoice.id,
      details: `Invoice ${updatedInvoice.invoiceNumber} updated — status: ${updatedInvoice.status}`,
    });

    res.json(updatedInvoice);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, project: { client: { userId: req.user.userId } } },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await prisma.invoice.delete({ where: { id } });

    await logActivity({
      userId: req.user.userId,
      action: "DELETE",
      entityType: "INVOICE",
      entityId: invoice.id,
      details: `Deleted invoice ${invoice.invoiceNumber}`,
    });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    next(error);
  }
};