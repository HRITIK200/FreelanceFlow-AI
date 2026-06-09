import prisma from "../utils/prisma.js";

export const createProject = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      budget,
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
          status,
          deadline:
            deadline
              ? new Date(deadline)
              : null,
          clientId,
        },
      });

    res.status(201).json(project);

  } catch (error) {

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

    const updatedProject =
      await prisma.project.update({
        where: { id },

        data: req.body,
      });

    res.json(updatedProject);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
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