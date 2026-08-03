import PDFDocument from "pdfkit";
import prisma from "../utils/prisma.js";

export const generateInvoicePDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, project: { client: { userId: req.user.userId } } },
      include: { project: { include: { client: true } } },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    // ── Blue Header ──────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 110).fill("#2563eb");

    doc.fillColor("white").fontSize(28).font("Helvetica-Bold").text("FreelanceFlow AI", 50, 28);
    doc.fontSize(12).font("Helvetica").text("Professional Invoice", 50, 62);

    // Invoice number badge (top-right)
    doc.fontSize(11).text(invoice.invoiceNumber, 0, 40, { align: "right", width: doc.page.width - 50 });
    doc.fontSize(9).text(invoice.status, 0, 58, { align: "right", width: doc.page.width - 50 });

    // ── Invoice Meta ─────────────────────────────────────────────────────────
    doc.y = 135;
    doc.fillColor("#111827").fontSize(10).font("Helvetica");

    const col1 = 50, col2 = 300;

    doc.font("Helvetica-Bold").text("INVOICE DETAILS", col1, doc.y);
    doc.font("Helvetica-Bold").text("CLIENT", col2, doc.y - doc.currentLineHeight());
    doc.moveDown(0.5);

    // FIX: was invoice.issueDate (undefined) — now correctly uses invoice.createdAt
    doc.font("Helvetica").fillColor("#374151")
      .text(`Issue Date: ${new Date(invoice.createdAt).toDateString()}`, col1)
      .text(`Due Date:   ${new Date(invoice.dueDate).toDateString()}`, col1)
      .text(`Status:     ${invoice.status}`, col1);

    const clientY = 148;
    doc.font("Helvetica").fillColor("#374151")
      .text(`Name:    ${invoice.project.client.name}`, col2, clientY)
      .text(`Email:   ${invoice.project.client.email}`, col2)
      .text(`Company: ${invoice.project.client.company || "N/A"}`, col2);

    // ── Divider ──────────────────────────────────────────────────────────────
    const divY = Math.max(doc.y, clientY + 50) + 10;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(50, divY).lineTo(545, divY).stroke();

    // ── Project Section ──────────────────────────────────────────────────────
    doc.y = divY + 16;
    doc.fillColor("#2563eb").fontSize(13).font("Helvetica-Bold").text("Project");
    doc.fillColor("#374151").fontSize(10).font("Helvetica")
      .text(`Title: ${invoice.project.title}`)
      .text(`Description: ${invoice.project.description || "N/A"}`);

    doc.moveDown(1.5);

    // ── Amount Box ───────────────────────────────────────────────────────────
    const boxY = doc.y;
    doc.roundedRect(50, boxY, 495, 90, 10).fillAndStroke("#eff6ff", "#2563eb");

    doc.fillColor("#2563eb").fontSize(11).font("Helvetica-Bold")
      .text("TOTAL AMOUNT DUE", 0, boxY + 16, { align: "center" });

    doc.fillColor("#1e40af").fontSize(32).font("Helvetica-Bold")
      .text(`₹${invoice.amount.toLocaleString()}`, 0, boxY + 38, { align: "center" });

    doc.y = boxY + 108;

    // ── Notes ─────────────────────────────────────────────────────────────────
    if (invoice.notes) {
      doc.moveDown(1);
      doc.fillColor("#2563eb").fontSize(13).font("Helvetica-Bold").text("Notes");
      doc.fillColor("#374151").fontSize(10).font("Helvetica").text(invoice.notes);
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 70;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(50, footerY).lineTo(545, footerY).stroke();
    doc.fillColor("#9ca3af").fontSize(9).font("Helvetica")
      .text("Thank you for doing business with FreelanceFlow AI", 50, footerY + 12, { align: "center", width: 495 })
      .text("Generated automatically · FreelanceFlow AI", { align: "center", width: 495 });

    doc.end();
  } catch (error) {
    next(error);
  }
};