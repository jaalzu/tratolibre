"use server";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordResponse,
  type ResetPasswordResponse,
} from "../schemas";
import { forgotPasswordService, resetPasswordService } from "../services";

export async function forgotPasswordAction(
  input: unknown,
): Promise<ForgotPasswordResponse> {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Email inválido",
    };
  }

  const result = await forgotPasswordService(parsed.data);

  return result;
}

/**
 * Server Action: Resetear contraseña
 */
export async function resetPasswordAction(
  input: unknown,
): Promise<ResetPasswordResponse> {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Contraseña inválida",
    };
  }

  const result = await resetPasswordService(parsed.data);

  return result;
}
