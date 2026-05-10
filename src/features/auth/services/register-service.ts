import { createClient } from "@/lib/supabase/client/server";

import { mapRegisterInputToSupabaseSignUp } from "../mappers";
import type { RegisterInput, RegisterResponse } from "../schemas";
import { ok, err } from "../schemas/base.schema";

/**
 * Service: Registrar nuevo usuario (sin verificación de email)
 */
export async function registerService(
  input: RegisterInput,
): Promise<RegisterResponse> {
  try {
    const supabase = await createClient();

    // Modificar el signUp para que NO requiera confirmación de email
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        // IMPORTANTE: esto evita que Supabase envíe el email de confirmación
        emailRedirectTo: undefined,
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          name: `${input.firstName} ${input.lastName}`,
        },
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return err("Este email ya está registrado");
      }

      if (error.message.includes("Unable to validate email")) {
        return err("Email inválido");
      }

      return err("Error al crear la cuenta. Intenta nuevamente.");
    }

    if (!data.user) {
      return err("No se pudo crear la cuenta");
    }

    // ✅ El usuario ya está logueado automáticamente
    // Supabase crea la sesión al hacer signUp
    return ok();
  } catch (error) {
    console.error("[registerService] Error inesperado:", error);
    return err("Error inesperado. Intenta nuevamente.");
  }
}
