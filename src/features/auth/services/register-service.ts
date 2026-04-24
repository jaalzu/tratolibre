import { createClient } from "@/lib/supabase/server";
import { mapRegisterInputToSupabaseSignUp } from "../mappers";
import type { RegisterInput, RegisterResponse } from "../schemas";
import { ok, err } from "../schemas/base.schema";

/**
 * Service: Registrar nuevo usuario
 */
export async function registerService(
  input: RegisterInput,
): Promise<RegisterResponse> {
  try {
    const supabase = await createClient();
    const signUpData = mapRegisterInputToSupabaseSignUp(input);
    const { data, error } = await supabase.auth.signUp(signUpData);

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

    return ok();
  } catch (error) {
    console.error("[registerService] Error inesperado:", error);
    return err("Error inesperado. Intenta nuevamente.");
  }
}
