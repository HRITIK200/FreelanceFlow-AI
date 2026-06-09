import prisma from "../utils/prisma.js";

export const logActivity = async ({
  userId,
  action,
  entityType,
  entityId,
  details,
}) => {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      details,
    },
  });
};