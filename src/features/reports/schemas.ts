import { z } from "zod";

export const ReportSchema = z.object({
  type: z.enum(["item", "conversation", "user"]),
  target_id: z.string().uuid(),
  reason: z.enum([
    "contenido_inapropiado",
    "spam",
    "producto_ilegal",
    "estafa",
    "acoso",
    "otro",
  ]),
  description: z.string().max(500).optional(),
});

export type ReportSchemaType = z.infer<typeof ReportSchema>;
