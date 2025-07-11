import { z } from "zod";

export const BlogGenOverviewSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  topic: z
    .string()
    .min(40, "Min 40 characters")
    .refine(
      (str) => (str.match(/\b\w+\b/g) || []).length >= 4,
      "Your topic must have at least 4 words",
    ),
  style: z.string().min(1, { message: "Style is required" }),
  audience: z.string().optional(),
  keywords: z.string().optional(),
});

export type BlogGenOverviewType = z.infer<typeof BlogGenOverviewSchema>;
