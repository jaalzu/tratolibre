import { z } from "zod";

/**
 * Schema para solicitar reseteo de contraseña
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
});

/**
 * Schema para resetear contraseña con token
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe contener mayúsculas, minúsculas y números",
    ),
});

// ✅ TYPES generados desde schemas
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Responses
 */
export type ForgotPasswordResponse =
  | { success: true }
  | { success: false; error: string };

export type ResetPasswordResponse =
  | { success: true }
  | { success: false; error: string };
