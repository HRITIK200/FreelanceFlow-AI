import prisma from "../utils/prisma.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userFilter = { client: { userId } };

    const [
      totalClients,
      totalProjects,
      completedProjects,
      totalInvoices,
      paidRevenue,
      pendingRevenue,
      overdueInvoices,
      clientStats,
    ] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.project.count({ where: userFilter }),
      prisma.project.count({ where: { ...userFilter, status: "COMPLETED" } }),
      prisma.invoice.count({ where: { project: userFilter.client } }),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: "PAID", project: userFilter.client },
      }),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: "PENDING", project: userFilter.client },
      }),
      prisma.invoice.count({
        where: { status: "PENDING", dueDate: { lt: new Date() }, project: userFilter.client },
      }),
      prisma.client.findMany({
        where: { userId },
        select: {
          name: true,
          company: true,
          projects: {
            select: {
              invoices: {
                where: { status: "PAID" },
                select: { amount: true },
              },
            },
          },
        },
      }),
    ]);

    const clientRevenueShares = clientStats
      .map((client) => ({
        name: client.company || client.name,
        value: client.projects.reduce(
          (sum, p) => sum + p.invoices.reduce((s, inv) => s + inv.amount, 0),
          0
        ),
      }))
      .filter((share) => share.value > 0);

    res.json({
      totalClients,
      totalProjects,
      completedProjects,
      totalInvoices,
      paidRevenue: paidRevenue._sum.amount || 0,
      pendingRevenue: pendingRevenue._sum.amount || 0,
      overdueInvoices,
      clientRevenueShares,
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userProjectFilter = { project: { client: { userId } } };

    // Monthly revenue for past 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const paidInvoices = await prisma.invoice.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: twelveMonthsAgo },
        ...userProjectFilter,
      },
      select: { amount: true, createdAt: true },
    });

    // Build monthly buckets
    const monthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = { month: key, revenue: 0, count: 0 };
    }
    paidInvoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += inv.amount;
        monthlyMap[key].count += 1;
      }
    });

    // Project status breakdown
    const projectStatusGroups = await prisma.project.groupBy({
      by: ["status"],
      where: { client: { userId } },
      _count: { id: true },
    });

    // Top clients by paid revenue
    const clients = await prisma.client.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        company: true,
        projects: {
          select: {
            budget: true,
            status: true,
            invoices: { where: { status: "PAID" }, select: { amount: true } },
          },
        },
      },
    });

    const topClients = clients
      .map((c) => ({
        id: c.id,
        name: c.company || c.name,
        paidRevenue: c.projects.reduce(
          (sum, p) => sum + p.invoices.reduce((s, inv) => s + inv.amount, 0),
          0
        ),
        projectCount: c.projects.length,
        completedCount: c.projects.filter((p) => p.status === "COMPLETED").length,
      }))
      .sort((a, b) => b.paidRevenue - a.paidRevenue)
      .slice(0, 5);

    // Invoice collection stats
    const [totalInv, paidInv] = await Promise.all([
      prisma.invoice.count({ where: { project: { client: { userId } } } }),
      prisma.invoice.count({ where: { status: "PAID", project: { client: { userId } } } }),
    ]);

    res.json({
      monthlyRevenue: Object.values(monthlyMap),
      projectStatusBreakdown: projectStatusGroups.map((g) => ({
        status: g.status,
        count: g._count.id,
      })),
      topClients,
      collectionRate: totalInv > 0 ? Math.round((paidInv / totalInv) * 100) : 0,
    });
  } catch (error) {
    next(error);
  }
};