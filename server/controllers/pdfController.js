import PDFDocument from "pdfkit";
import prisma from "../utils/prisma.js";

export const generateInvoicePDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, project: { client: { userId: req.user.userId } } },
      include: {
        project: { include: { client: true } },
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Fetch user details for Provider section
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, email: true, company: true, title: true },
    });

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    const pageWidth = doc.page.width; // 595.28 pt for A4
    const contentWidth = pageWidth - 80; // 515.28 pt
    const leftMargin = 40;
    const rightMargin = 555;

    // ── 1. Top Header Banner ──────────────────────────────────────────────────
    doc.rect(0, 0, pageWidth, 110).fill("#1e40af"); // Dark Blue

    // Title & Tagline
    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("FreelanceFlow AI", leftMargin, 28);
    doc.fontSize(10).font("Helvetica").fillColor("#93c5fd").text("Professional Invoice & Business Services", leftMargin, 58);

    // Invoice Number Badge (Top Right)
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#ffffff").text(invoice.invoiceNumber, leftMargin, 28, { align: "right", width: contentWidth });

    // Status Pill (Top Right under invoice number)
    const statusText = (invoice.status || "PENDING").toUpperCase();
    let statusBg = "#f59e0b"; // Pending = Amber
    if (statusText === "PAID") statusBg = "#10b981"; // Paid = Emerald
    if (statusText === "OVERDUE") statusBg = "#ef4444"; // Overdue = Red

    const statusBadgeWidth = 80;
    const statusBadgeX = rightMargin - statusBadgeWidth;
    doc.roundedRect(statusBadgeX, 54, statusBadgeWidth, 20, 10).fill(statusBg);
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold").text(statusText, statusBadgeX, 60, { align: "center", width: statusBadgeWidth });

    // ── 2. Meta Details (2-Column Grid) ──────────────────────────────────────
    const metaY = 135;
    const col1X = leftMargin;
    const col2X = 310;

    // Left Column: Invoice Details & Billed From
    doc.fillColor("#1f2937").fontSize(10).font("Helvetica-Bold").text("INVOICE DETAILS", col1X, metaY);
    doc.fillColor("#6b7280").fontSize(9).font("Helvetica");

    const issueDateStr = new Date(invoice.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
    const dueDateStr = new Date(invoice.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

    doc.text(`Issue Date: `, col1X, metaY + 18, { continued: true })
       .fillColor("#1f2937").font("Helvetica-Bold").text(issueDateStr);

    doc.fillColor("#6b7280").font("Helvetica").text(`Due Date:   `, col1X, metaY + 32, { continued: true })
       .fillColor("#1f2937").font("Helvetica-Bold").text(dueDateStr);

    doc.fillColor("#6b7280").font("Helvetica").text(`Provider:   `, col1X, metaY + 46, { continued: true })
       .fillColor("#1f2937").font("Helvetica-Bold").text(user?.name || "FreelanceFlow Business");

    // Right Column: Client (Billed To)
    const client = invoice.project?.client;
    doc.fillColor("#1f2937").fontSize(10).font("Helvetica-Bold").text("BILLED TO", col2X, metaY);

    doc.fillColor("#1f2937").fontSize(11).font("Helvetica-Bold").text(client?.name || "Client", col2X, metaY + 18);
    doc.fillColor("#4b5563").fontSize(9).font("Helvetica").text(client?.company || "Independent Client", col2X, metaY + 33);
    doc.fillColor("#6b7280").fontSize(9).font("Helvetica").text(client?.email || "", col2X, metaY + 46);

    // Horizontal Divider Line
    const divY = 205;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(leftMargin, divY).lineTo(rightMargin, divY).stroke();

    // ── 3. Itemized Invoice Table ─────────────────────────────────────────────
    const tableTopY = 225;

    // Table Header Background Row
    doc.rect(leftMargin, tableTopY, contentWidth, 24).fill("#f3f4f6");

    // Table Header Text
    doc.fillColor("#374151").fontSize(9).font("Helvetica-Bold");
    doc.text("ITEM & DESCRIPTION", leftMargin + 10, tableTopY + 7);
    doc.text("CLIENT / CATEGORY", 310, tableTopY + 7);
    doc.text("AMOUNT", leftMargin, tableTopY + 7, { align: "right", width: contentWidth - 10 });

    // Table Data Row
    const rowY = tableTopY + 32;
    const amountStr = `INR ${invoice.amount.toLocaleString("en-IN")}`;

    // Item Title & Description
    doc.fillColor("#111827").fontSize(10).font("Helvetica-Bold").text(invoice.project?.title || "Freelance Services", leftMargin + 10, rowY, { width: 250 });

    const descText = invoice.project?.description || invoice.notes || "Professional freelance development and consulting services.";
    doc.fillColor("#6b7280").fontSize(8.5).font("Helvetica").text(descText, leftMargin + 10, rowY + 16, { width: 250 });

    // Client / Category Column
    doc.fillColor("#374151").fontSize(9.5).font("Helvetica").text(client?.company || client?.name || "Services", 310, rowY);

    // Amount Column
    doc.fillColor("#1e40af").fontSize(11).font("Helvetica-Bold").text(amountStr, leftMargin, rowY, { align: "right", width: contentWidth - 10 });

    // Table Bottom Divider Line
    const tableBottomY = rowY + 55;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(leftMargin, tableBottomY).lineTo(rightMargin, tableBottomY).stroke();

    // ── 4. Total Amount Callout Box ──────────────────────────────────────────
    const totalBoxY = tableBottomY + 25;
    const boxWidth = 250;
    const boxX = rightMargin - boxWidth;

    doc.roundedRect(boxX, totalBoxY, boxWidth, 70, 8).fillAndStroke("#f0f9ff", "#0284c7");

    doc.fillColor("#0369a1").fontSize(9).font("Helvetica-Bold").text("TOTAL AMOUNT DUE", boxX, totalBoxY + 14, { align: "center", width: boxWidth });
    doc.fillColor("#0c4a6e").fontSize(20).font("Helvetica-Bold").text(amountStr, boxX, totalBoxY + 32, { align: "center", width: boxWidth });

    // ── 5. Payment Notes / Instructions Block ───────────────────────────────
    if (invoice.notes) {
      const notesY = totalBoxY;
      const notesWidth = 230;

      doc.fillColor("#1f2937").fontSize(10).font("Helvetica-Bold").text("Payment Notes & Instructions", leftMargin, notesY);
      doc.fillColor("#4b5563").fontSize(8.5).font("Helvetica").text(invoice.notes, leftMargin, notesY + 16, { width: notesWidth, lineGap: 3 });
    }

    // ── 6. Single-Page Footer ────────────────────────────────────────────────
    // Disable bottom page break trigger to guarantee single-page rendering
    doc.page.margins.bottom = 0;

    const footerY = 780; // Safe Y position on A4 page (height = 841.89pt)

    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(leftMargin, footerY - 15).lineTo(rightMargin, footerY - 15).stroke();

    doc.fillColor("#4b5563").fontSize(8.5).font("Helvetica")
       .text("Thank you for doing business with FreelanceFlow AI", leftMargin, footerY - 5, { align: "center", width: contentWidth })
       .fillColor("#9ca3af").fontSize(7.5)
       .text("Generated automatically by FreelanceFlow AI · Dynamic Business Platform", leftMargin, footerY + 8, { align: "center", width: contentWidth });

    doc.end();
  } catch (error) {
    next(error);
  }
};