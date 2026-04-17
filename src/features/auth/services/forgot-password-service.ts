// features/auth/services/forgot-password.service.ts

import { createClient } from "@/lib/supabase/server";
import type {
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "../schemas";

/**
 * Service: Solicitar reseteo de contraseña
 */
export async function forgotPasswordService(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: "Error al enviar el email. Intenta nuevamente.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[forgotPasswordService] Error:", error);
    return {
      success: false,
      error: "Error inesperado. Intenta nuevamente.",
    };
  }
}

/**
 * Service: Resetear contraseña con token
 */
export async function resetPasswordService(
  input: ResetPasswordInput,
): Promise<ResetPasswordResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: input.password,
    });

    if (error) {
      return {
        success: false,
        error: "Error al cambiar la contraseña. Intenta nuevamente.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[resetPasswordService] Error:", error);
    return {
      success: false,
      error: "Error inesperado. Intenta nuevamente.",
    };
  }
}
