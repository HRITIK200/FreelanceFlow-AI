import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

export const createClient = async (req, res) => {
  try {
    const { name, email, company } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        userId: req.user.userId,
      },
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
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMyClients = async (req, res) => {
  try {

    const clients =
      await prisma.client.findMany({
        where: {
          userId: req.user.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json(clients);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const updateClient = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, email, company } =
      req.body;

    const existingClient =
      await prisma.client.findFirst({
        where: {
          id,
          userId: req.user.userId,
        },
      });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const updatedClient =
      await prisma.client.update({
        where: { id },

        data: {
          name,
          email,
          company,
        },
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

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const deleteClient = async (req, res) => {

  try {

    const { id } = req.params;

    const existingClient =
      await prisma.client.findFirst({
        where: {
          id,
          userId: req.user.userId,
        },
      });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    await prisma.client.delete({
      where: { id },
    });

    await logActivity({
      userId: req.user.userId,
      action: "DELETE",
      entityType: "CLIENT",
      entityId: existingClient.id,
      details: `Deleted client ${existingClient.name}`,
    });

    res.json({
      message:
        "Client deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getClientDetails = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const client =
      await prisma.client.findFirst({
        where: {
          id,
          userId: req.user.userId,
        },

        include: {
          projects: {
            include: {
              invoices: true,
            },
          },
        },
      });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const totalProjects =
      client.projects.length;

    const completedProjects =
      client.projects.filter(
        (p) => p.status === "COMPLETED"
      ).length;

    const totalRevenue =
      client.projects.reduce(
        (sum, project) =>
          sum + (project.budget || 0),
        0
      );

    const pendingRevenue =
      client.projects
        .flatMap(
          (project) => project.invoices
        )
        .filter(
          (invoice) =>
            invoice.status !== "PAID"
        )
        .reduce(
          (sum, invoice) =>
            sum + invoice.amount,
          0
        );

    const recentInvoices =
      client.projects
        .flatMap(
          (project) => project.invoices
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

    res.json({
      client,
      totalProjects,
      completedProjects,
      totalRevenue,
      pendingRevenue,
      recentInvoices,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};