import { z } from "zod";

export const ReviewSchema = z.object({
  purchase_id: z.string().uuid(),
  reviewed_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  role: z.enum(["buyer", "seller"]),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;
