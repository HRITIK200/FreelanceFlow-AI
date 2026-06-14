import PDFDocument from "pdfkit";
import prisma from "../utils/prisma.js";

console.log("pdfController.js loaded");

export const generateInvoicePDF =
  async (req, res) => {

    try {
      
      console.log("NEW PDF TEMPLATE RUNNING");
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
      
      //Header
      doc.fontSize(28)
         .fillColor("#2563eb")
         .text("FreelanceFlow AI", {
         align: "center",
        });      
      doc.fontSize(18)
         .fillColor("black")
         .text("Professional Invoice", {
         align: "center",
        });  

      doc.moveDown(2);
      
      // Invoice Information
      doc.fontSize(12)
         .text(
           `Invoice Number: ${invoice.invoiceNumber}`
         );
      doc.text(
          `Issue Date: ${invoice.issueDate.toDateString()}`
         );

      doc.text(
         `Due Date: ${invoice.dueDate.toDateString()}`
         );

      doc.text(
        `Status: ${invoice.status}`
      );
      doc.moveDown();

      //Divider

      doc.moveTo(50, 180)
         .lineTo(550, 180)
         .stroke();
      doc.moveDown();

      //Client Details

      doc.fontSize(16)
         .fillColor("#2563eb")
         .text("Client Information");

      doc.fillColor("black")
         .fontSize(12)
         .text(`Client Name: ${invoice.project.client.name}`);
      doc.moveDown();
      
      //Project Details

      doc.fontSize(16)
         .fillColor("#2563eb")
         .text("Project Information");

      doc.fillColor("black")
         .fontSize(12)
         .text(`Project: ${invoice.project.title}`

         );
      doc.moveDown();

      //Amount box

      doc.roundedRect(50, 320, 500, 100, 10)
         .fillAndStroke("#eff6ff","#2563eb");
      doc.fillColor("#1e40af")
         .fontSize(24)
         .text(`₹${invoice.amount.toLocaleString()}`,
          70, 355
         );
      doc.moveDown(4);

      //Notes

      doc.fillColor("#2563eb")
         .fontSize(16)
         .text("Notes");

      doc.moveDown(0.5);

      doc.fontSize(12)
         .fillColor("black")
         .text(invoice.notes || "No additional notes.");

      //Footer

      doc.fontSize(10)
         .fillColor("gray")
         .text("Thank you for doing business with FreelanceFlow AI.",
          {
            align: "center",
          }
         );
      doc.text(
        "Generated automatically by FreelanceFlow AI",
      {
        align: "center",
      }
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