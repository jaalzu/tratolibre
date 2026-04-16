// features/auth/schemas/login.schema.ts

import { z } from "zod";

/**
 * Schema de validación para login
 */
export const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),

  password: z.string().min(1, "La contraseña es requerida"),
});

/**
 * Schema para el servidor (más estricto)
 */
export const loginServerSchema = loginSchema.extend({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginServerInput = z.infer<typeof loginServerSchema>;

/**
 * Response del login
 */
export type LoginResponse =
  | { success: true; user: { id: string; email: string } }
  | { success: false; error: string };
