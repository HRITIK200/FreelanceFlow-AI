import prisma from "../utils/prisma.js";
import { sendInvoiceEmail } from "../services/emailService.js";
import { logActivity } from "../services/activityService.js";

export const emailInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, project: { client: { userId: req.user.userId } } },
      include: { project: { include: { client: true } } },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const { client } = invoice.project;
    const amountFormatted = `₹${invoice.amount.toLocaleString()}`;
    const dueFormatted = new Date(invoice.dueDate).toDateString();

    await sendInvoiceEmail({
      to: client.email,
      subject: `Invoice ${invoice.invoiceNumber} from FreelanceFlow AI`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f9fafb">
          <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
            <div style="background:#2563eb;padding:32px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">FreelanceFlow AI</h1>
              <p style="color:#bfdbfe;margin:8px 0 0">Invoice ${invoice.invoiceNumber}</p>
            </div>
            <div style="padding:32px">
              <p style="color:#374151;font-size:16px">Hi ${client.name},</p>
              <p style="color:#6b7280">Please find your invoice details below:</p>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:24px;margin:24px 0;text-align:center">
                <p style="color:#1d4ed8;font-size:14px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Amount Due</p>
                <p style="color:#1e40af;font-size:36px;font-weight:700;margin:0">${amountFormatted}</p>
                <p style="color:#6b7280;font-size:13px;margin:8px 0 0">Due by ${dueFormatted}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
                <tr><td style="padding:8px 0;color:#9ca3af;width:140px">Invoice Number</td><td style="font-weight:600">${invoice.invoiceNumber}</td></tr>
                <tr><td style="padding:8px 0;color:#9ca3af">Project</td><td style="font-weight:600">${invoice.project.title}</td></tr>
                <tr><td style="padding:8px 0;color:#9ca3af">Status</td><td><span style="background:#fef3c7;color:#d97706;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:700">${invoice.status}</span></td></tr>
                ${invoice.notes ? `<tr><td style="padding:8px 0;color:#9ca3af;vertical-align:top">Notes</td><td>${invoice.notes}</td></tr>` : ""}
              </table>
            </div>
            <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
              <p style="color:#9ca3af;font-size:12px;margin:0">Sent via FreelanceFlow AI · Automated Invoice System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    await logActivity({
      userId: req.user.userId,
      action: "SEND",
      entityType: "INVOICE",
      entityId: invoice.id,
      details: `Sent invoice ${invoice.invoiceNumber} to ${client.email}`,
    });

    res.json({ message: `Invoice ${invoice.invoiceNumber} sent to ${client.email}` });
  } catch (error) {
    next(error);
  }
};