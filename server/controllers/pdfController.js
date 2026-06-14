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
        new PDFDocument({
          margin: 50,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoice.invoiceNumber}.pdf`
      );

doc.pipe(res);
      
// Blue Header Background
doc.rect(0, 0, doc.page.width, 100)
   .fill("#2563eb");

doc.fillColor("white")
   .fontSize(30)
   .text("FreelanceFlow AI", 0, 30, {
      align: "center",
   });

doc.fontSize(14)
   .text("Professional Invoice", {
      align: "center",
   });

doc.moveDown(4);
      
// Invoice Information
doc.y = 130;

doc.fillColor("black")
   .fontSize(12);

doc.x = 50;  

doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
doc.text(`Status: ${invoice.status}`);

doc.moveDown();

//Divider

doc.strokeColor("#d1d5db")
   .moveTo(50, doc.y)
   .lineTo(550, doc.y)
   .stroke();

doc.moveDown();

//Client Details

doc.fillColor("#2563eb")
   .fontSize(16)
   .text("Client Information");

doc.fillColor("black")
   .fontSize(12)
   .text(`Client Name: ${invoice.project.client.name}`);

doc.moveDown();
      
//Project Details

doc.fillColor("#2563eb")
   .fontSize(16)
   .text("Project Information");

doc.fillColor("black")
   .fontSize(12)
   .text(`Project: ${invoice.project.title}`);

doc.moveDown(2);

//Amount box

const boxY = doc.y;

doc.roundedRect(
   50,
   boxY,
   500,
   90,
   10
).fillAndStroke(
   "#eff6ff",
   "#2563eb"
);

doc.fillColor("#2563eb")
   .fontSize(14)
   .text(
      "TOTAL AMOUNT",
      0,
      boxY + 18,
      {
         align: "center",
      }
   );

doc.fillColor("#1e40af")
   .fontSize(28)
   .text(
      `₹${invoice.amount.toLocaleString()}`,
      0,
      boxY + 42,
      {
         align: "center",
      }
   );

doc.y = boxY + 120;

//Notes

doc.fillColor("#2563eb")
   .fontSize(16)
   .text("Notes");

doc.moveDown(0.5);

doc.fillColor("black")
   .fontSize(12)
   .text(
      invoice.notes ||
      "No additional notes."
   );

doc.moveDown(3);

// Footer

const footerY = 700;

doc.strokeColor("#d1d5db")
   .moveTo(50, footerY)
   .lineTo(550, footerY)
   .stroke();

doc.fillColor("gray")
   .fontSize(10)
   .text(
      "Thank you for doing business with FreelanceFlow AI",
      50,
      footerY + 15,
      {
         width: 500,
         align: "center",
      }
   );

doc.text(
   "Generated automatically by FreelanceFlow AI",
   {
      width: 500,
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