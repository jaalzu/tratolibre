import { createClient } from "@/lib/supabase/client/server";

import type { LoginServerInput, LoginResponse } from "../schemas";
import { ok, err } from "../schemas/base.schema";

/**
 * Service: Login con email y password (sin validar email confirmado)
 */
export async function loginService(
  input: LoginServerInput,
): Promise<LoginResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return err("Email o contraseña incorrectos");
      }

      // ❌ REMOVIDO: Ya no checkeamos "Email not confirmed"

      return err("Error al iniciar sesión. Intenta nuevamente.");
    }

    if (!data.user) {
      return err("No se pudo obtener la información del usuario");
    }

    return ok();
  } catch (error) {
    console.error("[loginService] Error inesperado:", error);
    return err("Error inesperado. Intenta nuevamente.");
  }
}
