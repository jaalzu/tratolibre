import { z } from "zod";
import { nameSchema } from "@/lib/validations/name";
import type { ActionResult } from "./base.schema";

/**
 * Schema de validación para registro
 */
export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe contener mayúsculas, minúsculas y números",
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Response del registro - usando ActionResult
 */
export type RegisterResponse = ActionResult<void>;
