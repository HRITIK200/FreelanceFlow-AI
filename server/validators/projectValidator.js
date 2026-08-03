import { z } from "zod";

const statusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]);

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  budget: z.number().min(0, "Budget must be non-negative").optional().nullable(),
  progress: z.number().min(0).max(100).optional().default(0),
  status: statusEnum.optional().default("PENDING"),
  deadline: z.string().optional().nullable().or(z.literal("")),
  clientId: z.string().min(1, "Client ID is required"),
  tags: z.string().max(500).optional().nullable().or(z.literal("")),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable().or(z.literal("")),
  budget: z.number().min(0).optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
  status: statusEnum.optional(),
  deadline: z.string().optional().nullable().or(z.literal("")),
  tags: z.string().max(500).optional().nullable().or(z.literal("")),
});
