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