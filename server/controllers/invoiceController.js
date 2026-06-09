import prisma from "../utils/prisma.js";

export const createInvoice = async (
  req,
  res
) => {
  try {

    const {
      invoiceNumber,
      amount,
      dueDate,
      projectId,
    } = req.body;

    const project =
      await prisma.project.findFirst({
        where: {
          id: projectId,
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

    const invoice =
      await prisma.invoice.create({
        data: {
          invoiceNumber,
          amount,
          dueDate:
            new Date(dueDate),
          projectId,
        },
      });

    res.status(201).json(
      invoice
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};