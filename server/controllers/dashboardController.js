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


      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};