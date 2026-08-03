import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

export const createProject = async (req, res, next) => {
  try {
    const { title, description, budget, progress, status, deadline, clientId, tags } = req.body;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: req.user.userId },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        progress: Number(progress) || 0,
        status: status || "PENDING",
        deadline: deadline ? new Date(deadline) : null,
        clientId,
        tags,
      },
      include: { client: true },
    });

    await logActivity({
      userId: req.user.userId,
      action: "CREATE",
      entityType: "PROJECT",
      entityId: project.id,
      details: `Created project "${project.title}"`,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const { status, clientId, search } = req.query;

    const projects = await prisma.project.findMany({
      where: {
        client: { userId: req.user.userId },
        ...(status && { status }),
        ...(clientId && { clientId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, client: { userId: req.user.userId } },
      include: { client: true, invoices: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, client: { userId: req.user.userId } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // FIX: Explicitly destructure — no mass assignment of raw req.body
    const { title, description, budget, progress, status, deadline, tags } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(budget !== undefined && { budget }),
        ...(progress !== undefined && { progress: Number(progress) }),
        ...(status !== undefined && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(tags !== undefined && { tags }),
      },
      include: { client: true },
    });

    await logActivity({
      userId: req.user.userId,
      action: "UPDATE",
      entityType: "PROJECT",
      entityId: updatedProject.id,
      details: `Updated project "${updatedProject.title}"`,
    });

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, client: { userId: req.user.userId } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    await prisma.project.delete({ where: { id } });

    await logActivity({
      userId: req.user.userId,
      action: "DELETE",
      entityType: "PROJECT",
      entityId: project.id,
      details: `Deleted project "${project.title}"`,
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};