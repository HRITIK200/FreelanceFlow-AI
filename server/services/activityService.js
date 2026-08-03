import prisma from "../utils/prisma.js";

export const logActivity = async ({ userId, action, entityType, entityId, details }) => {
  try {
    await prisma.activityLog.create({
      data: { userId, action, entityType, entityId, details },
    });
  } catch (err) {
    // Activity log failures should never crash the parent operation
    console.error("[ActivityLog] Failed to write log:", err.message);
  }
};