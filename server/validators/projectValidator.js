import { z } from "zod";

const statusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]);

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  budget: z.number().min(0, "Budget must be non-negative").optional(),
  progress: z.number().min(0).max(100).optional().default(0),
  status: statusEnum.optional().default("PENDING"),
  deadline: z.string().datetime({ offset: true }).optional().nullable(),
  clientId: z.string().min(1, "Client ID is required"),
  tags: z.string().max(500).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  budget: z.number().min(0).optional(),
  progress: z.number().min(0).max(100).optional(),
  status: statusEnum.optional(),
  deadline: z.string().datetime({ offset: true }).optional().nullable(),
  tags: z.string().max(500).optional(),
});
