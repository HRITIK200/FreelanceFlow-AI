import prisma from "../utils/prisma.js";
import { logActivity } from "../services/activityService.js";

export const createInvoice = async (
  req,
  res
) => {
  try {

    const {
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

    const lastInvoice =
      await prisma.invoice.findFirst({
        orderBy: {
          createdAt: "desc",
        }
      });
    let nextNumber = 1;

    if(lastInvoice){

      const lastNumber =
        parseInt(
          lastInvoice.invoiceNumber
            .replace("INV-", "")
        );
      nextNumber =
        lastNumber + 1;
    }

    const invoiceNumber =
      `INV-${String(nextNumber)
        .padStart(3, "0")}`;

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
    
    await logActivity({
      userId: req.user.userId,
      action: "CREATE",
      entityType: "INVOICE",
      entityId: invoice.id,
      details: `Created invoice ${invoice.invoiceNumber}`,
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

      await logActivity({
        userId: req.user.userId,
        action: "UPDATE",
        entityType: "INVOICE",
        entityId: updatedInvoice.id,
        details: `Invoice ${updatedInvoice.invoiceNumber} marked ${updatedInvoice.status}`,
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

export const deleteInvoice = async (req, res) => {
  
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

      await logActivity({
        userId: req.user.userId,
        action: "DELETE",
        entityType: "INVOICE",
        entityId: invoice.id,
        details: `Deleted invoice ${invoice.invoiceNumber}`,
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