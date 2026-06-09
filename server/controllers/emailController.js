import prisma from "../utils/prisma.js";

import {
  sendInvoiceEmail,
} from "../services/emailService.js";

import { logActivity } from "../services/activityService.js";


export const emailInvoice =
  async (req, res) => {

    try {

      const { id } =
        req.params;

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

          include: {
            project: {
              include: {
                client: true,
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

      await sendInvoiceEmail({
        to:
          invoice.project.client.email,

        subject:
          `Invoice ${invoice.invoiceNumber}`,

        html: `
          <h1>Invoice</h1>

          <p>
            Invoice Number:
            ${invoice.invoiceNumber}
          </p>

          <p>
            Amount:
            ₹${invoice.amount}
          </p>

          <p>
            Status:
            ${invoice.status}
          </p>

          <p>
            Project:
            ${invoice.project.title}
          </p>
        `,
      });

      await logActivity({
        userId: req.user.userId,
        action: "SEND",
        entityType: "INVOICE",
        entityId: invoice.id,
        details: `Sent invoice ${invoice.invoiceNumber} to ${invoice.project.client.email}`,
      });

      res.json({
        message:
          "Invoice email sent successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};