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

export const getInvoices = async (
  req,
  res
) => {
  try {

    const invoices =
      await prisma.invoice.findMany({
        where: {
          project: {
            client: {
              userId:
                req.user.userId,
            },
          },
        },

        include: {
          project: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(invoices);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};

export const updateInvoiceStatus =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;

      const invoice =
        await prisma.invoice.findFirst({
          where: {
            id,

            project: {
              client: {
                userId:
                  req.user.userId,
              },
            },
          },
        });

      if (!invoice) {
        return res.status(404).json({
          message:
            "Invoice not found",
        });
      }

      const updatedInvoice =
        await prisma.invoice.update({
          where: { id },

          data: {
            status,
          },
        });

      res.json(
        updatedInvoice
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};

export const deleteInvoice =
  async (req, res) => {

    try {

      const { id } = req.params;

      const invoice =
        await prisma.invoice.findFirst({
          where: {
            id,

            project: {
              client: {
                userId:
                  req.user.userId,
              },
            },
          },
        });

      if (!invoice) {
        return res.status(404).json({
          message:
            "Invoice not found",
          });
      }

      await prisma.invoice.delete({
        where: { id },
      });

      res.json({
        message:
          "Invoice deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};