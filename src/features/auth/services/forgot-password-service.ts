// features/auth/services/forgot-password.service.ts

import { createClient } from "@/lib/supabase/server";
import type {
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "../schemas";
import { ok, err } from "../schemas/base.schema";

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
      return err("Error al enviar el email. Intenta nuevamente.");
    }

    return ok();
  } catch (error) {
    console.error("[forgotPasswordService] Error:", error);
    return err("Error inesperado. Intenta nuevamente.");
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
      return err("Error al cambiar la contraseña. Intenta nuevamente.");
    }

    return ok();
  } catch (error) {
    console.error("[resetPasswordService] Error:", error);
    return err("Error inesperado. Intenta nuevamente.");
  }
}
