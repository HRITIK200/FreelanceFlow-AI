import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  title: z.string().max(150).optional(),
  company: z.string().max(150).optional(),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  hourlyRate: z.number().min(0).max(999999).optional(),
});
