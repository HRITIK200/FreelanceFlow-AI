import prisma from "../utils/prisma.js";

export const getActivities = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: {
          userId: req.user.userId,
          ...(category && { entityType: category.toUpperCase() }),
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.activityLog.count({
        where: {
          userId: req.user.userId,
          ...(category && { entityType: category.toUpperCase() }),
        },
      }),
    ]);

    res.json({
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};