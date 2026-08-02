import prisma from "../utils/prisma.js";

export const getDashboardStats =
  async (req, res) => {

    try {

      const totalClients =
        await prisma.client.count({
          where: {
            userId:
              req.user.userId,
          },
        });

      const totalProjects =
        await prisma.project.count({
          where: {
            client: {
              userId:
                req.user.userId,
            },
          },
        });

      const completedProjects =
        await prisma.project.count({
          where: {
            status: "COMPLETED",

            client: {
              userId:
                req.user.userId,
            },
          },
        });

      const revenue =
        await prisma.project.aggregate({
          _sum: {
            budget: true,
          },

          where: {
            status: "COMPLETED",

            client: {
              userId:
                req.user.userId,
            },
          },
        });

        const totalInvoices =
          await prisma.invoice.count({
            where: {
              project: {
                client: {
                  userId:
                    req.user.userId,
                },
              },
            },
          });

        const paidRevenue =
          await prisma.invoice.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              status: "PAID",
              project: {
                client: {
                  userId:
                    req.user.userId,
                },
              },
            },
          });
        
        const pendingRevenue =
          await prisma.invoice.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              status: "PENDING",
              project: {
                client: {
                  userId:
                    req.user.userId,
                },
              },
            },
          });

        const overdueInvoices =
          await prisma.invoice.count({
            where: {
              status: "PENDING",
              dueDate: {
                lt: new Date(),
              },
              project: {
                client: {
                  userId:
                    req.user.userId,
                },
              },
            },
          });

      // Calculate paid client revenue share breakdown
      const clientStats = await prisma.client.findMany({
        where: { userId: req.user.userId },
        select: {
          name: true,
          company: true,
          projects: {
            select: {
              invoices: {
                where: { status: "PAID" },
                select: { amount: true }
              }
            }
          }
        }
      });

      const clientRevenueShares = clientStats.map(client => {
        let totalPaid = 0;
        client.projects.forEach(project => {
          project.invoices.forEach(inv => {
            totalPaid += inv.amount;
          });
        });
        return {
          name: client.company || client.name,
          value: totalPaid
        };
      }).filter(share => share.value > 0);

      res.json({
        totalClients,
        totalProjects,
        completedProjects,
        totalInvoices,

        paidRevenue:
          paidRevenue._sum.amount || 0,
        
        pendingRevenue:
          pendingRevenue._sum.amount || 0,
          
        overdueInvoices,
        clientRevenueShares,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};