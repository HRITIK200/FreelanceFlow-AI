import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

export const createProject = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      budget,
      progress,
      status,
      deadline,
      clientId,
    } = req.body;

    const client =
      await prisma.client.findFirst({
        where: {
          id: clientId,
          userId: req.user.userId,
        },
      });

    if (!client) {
      return res.status(404).json({
        message:
          "Client not found",
      });
    }

    const project =
      await prisma.project.create({
        data: {
          title,
          description,
          budget,
          progress: Number(progress) || 0,
          status,
          deadline:
            deadline
              ? new Date(deadline)
              : null,
          clientId,
        },
      });
    
    await logActivity({
      userId: req.user.userId,
      action: "CREATE",
      entityType: "PROJECT",
      entityId: project.id,
      details: `Created project ${project.title}`,
    });


    res.status(201).json(project);

  } catch (error) {
    
    console.error("UPDATE PROJECT ERROR:");
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getProjects = async (
  req,
  res
) => {
  try {

    const projects =
      await prisma.project.findMany({
        where: {
          client: {
            userId:
              req.user.userId,
          },
        },

        include: {
          client: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json(
      projects
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const updateProject = async (
  req,
  res
) => {
  console.log("=================================");
  console.log("UPDATE PROJECT ROUTE HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);
  console.log("=================================");
  try {

    const { id } = req.params;

    const project =
      await prisma.project.findFirst({
        where: {
          id,
          client: {
            userId:
              req.user.userId,
          },
        },
      });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    //delete 
    console.log("REQ BODY:", req.body);

    const updatedProject =
      await prisma.project.update({
        where: { id },

        data: req.body,
      });
    
     await logActivity({
      userId: req.user.userId,
      action: "UPDATE",
      entityType: "PROJECT",
      entityId: updatedProject.id,
      details: `Updated project ${updatedProject.title}`,
     });

    res.json(updatedProject);

  } catch (error) {
    
    console.log("=================================");
  console.log("UPDATE PROJECT ERROR");
  console.error(error);
  console.log("MESSAGE:", error.message);
  console.log("=================================");
    res.status(500).json({
      message:
        error.message,
    });

  }
};

export const deleteProject = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const project =
      await prisma.project.findFirst({
        where: {
          id,
          client: {
            userId:
              req.user.userId,
          },
        },
      });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    await prisma.project.delete({
      where: { id },
    });
    
    await logActivity({
      userId: req.user.userId,
      action: "DELETE",
      entityType: "PROJECT",
      entityId: project.id,
      details: `Deleted project ${project.title}`,
    });

    
    res.json({
      message:
        "Project deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};