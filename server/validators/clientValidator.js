import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  email: z.string().email("Invalid email").optional(),
  company: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  notes: z.string().max(1000).optional(),
});
