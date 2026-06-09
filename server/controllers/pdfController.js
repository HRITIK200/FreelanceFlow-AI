import PDFDocument from "pdfkit";
import prisma from "../utils/prisma.js";

export const generateInvoicePDF =
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

      const doc =
        new PDFDocument();

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoice.invoiceNumber}.pdf`
      );

      doc.pipe(res);

      doc.fontSize(24)
         .text("INVOICE");

      doc.moveDown();

      doc.fontSize(14)
         .text(
           `Invoice Number: ${invoice.invoiceNumber}`
         );

      doc.text(
        `Status: ${invoice.status}`
      );

      doc.text(
        `Amount: ₹${invoice.amount}`
      );

      doc.text(
        `Issue Date: ${invoice.issueDate.toDateString()}`
      );

      doc.text(
        `Due Date: ${invoice.dueDate.toDateString()}`
      );

      doc.moveDown();

      doc.text(
        `Client: ${invoice.project.client.name}`
      );

      doc.text(
        `Project: ${invoice.project.title}`
      );

      doc.moveDown();

      doc.text(
        `Notes: ${invoice.notes || "N/A"}`
      );

      doc.end();

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
};