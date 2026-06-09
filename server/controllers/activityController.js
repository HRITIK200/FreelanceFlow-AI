import prisma from "../utils/prisma.js";

export const getActivities =
  async (req, res) => {

    try {

      const activities =
        await prisma.activityLog.findMany({
          where: {
            userId:
              req.user.userId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 50,
        });

      res.json(
        activities
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};