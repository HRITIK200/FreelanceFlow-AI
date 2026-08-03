import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

export const createClient = async (req, res, next) => {
  try {
    const { name, email, company, phone, notes } = req.body;

    const client = await prisma.client.create({
      data: { name, email, company, phone, notes, userId: req.user.userId },
    });

    await logActivity({
      userId: req.user.userId,
      action: "CREATE",
      entityType: "CLIENT",
      entityId: client.id,
      details: `Created client ${client.name}`,
    });

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const getMyClients = async (req, res, next) => {
  try {
    const { search } = req.query;

    const clients = await prisma.client.findMany({
      where: {
        userId: req.user.userId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, company, phone, notes } = req.body;

    const existingClient = await prisma.client.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: { name, email, company, phone, notes },
    });

    await logActivity({
      userId: req.user.userId,
      action: "UPDATE",
      entityType: "CLIENT",
      entityId: updatedClient.id,
      details: `Updated client ${updatedClient.name}`,
    });

    res.json(updatedClient);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingClient = await prisma.client.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.client.delete({ where: { id } });

    await logActivity({
      userId: req.user.userId,
      action: "DELETE",
      entityType: "CLIENT",
      entityId: existingClient.id,
      details: `Deleted client ${existingClient.name}`,
    });

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getClientDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findFirst({
      where: { id, userId: req.user.userId },
      include: {
        projects: { include: { invoices: true } },
      },
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    const totalProjects = client.projects.length;
    const completedProjects = client.projects.filter((p) => p.status === "COMPLETED").length;
    const totalRevenue = client.projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    const allInvoices = client.projects.flatMap((p) => p.invoices);
    const pendingRevenue = allInvoices.filter((inv) => inv.status !== "PAID").reduce((sum, inv) => sum + inv.amount, 0);
    const paidRevenue = allInvoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0);
    const recentInvoices = [...allInvoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    res.json({ client, totalProjects, completedProjects, totalRevenue, pendingRevenue, paidRevenue, recentInvoices });
  } catch (error) {
    next(error);
  }
};