import { z } from "zod";
import { nameSchema } from "@/lib/validations/name";

export const EditProfileSchema = z.object({
  name: nameSchema,

  location: z
    .string()
    .max(60, "Máximo 60 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s,.\-]+$/,
      "Solo se permiten letras, números y puntuación básica",
    )
    .optional()
    .or(z.literal("")),

  province: z.string().optional(),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
