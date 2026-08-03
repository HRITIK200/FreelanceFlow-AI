import { z } from "zod";

const invoiceStatusEnum = z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);

export const createInvoiceSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  projectId: z.string().min(1, "Project ID is required"),
  notes: z.string().max(1000).optional(),
  status: invoiceStatusEnum.optional().default("PENDING"),
});

export const updateInvoiceSchema = z.object({
  status: invoiceStatusEnum.optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
});
