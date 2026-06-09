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

      res.json({
        totalClients,
        totalProjects,
        completedProjects,

        totalRevenue:
          revenue._sum.budget || 0,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};