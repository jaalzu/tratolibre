import { createClient } from "@/lib/supabase/server";
import { mapRegisterInputToSupabaseSignUp } from "../mappers";
import type { RegisterInput, RegisterResponse } from "../schemas";

/**
 * Service: Registrar nuevo usuario
 *
 * @param input - Datos del formulario validados
 * @returns RegisterResponse con success/error
 */
export async function registerService(
  input: RegisterInput,
): Promise<RegisterResponse> {
  try {
    const supabase = await createClient();

    const signUpData = mapRegisterInputToSupabaseSignUp(input);

    const { data, error } = await supabase.auth.signUp(signUpData);

    if (error) {
      // Usuario ya existe
      if (error.message.includes("User already registered")) {
        return {
          success: false,
          error: "Este email ya está registrado",
        };
      }

      // Email inválido
      if (error.message.includes("Unable to validate email")) {
        return {
          success: false,
          error: "Email inválido",
        };
      }

      // Error genérico
      return {
        success: false,
        error: "Error al crear la cuenta. Intenta nuevamente.",
      };
    }

    //  Validar que se creó el usuario
    if (!data.user) {
      return {
        success: false,
        error: "No se pudo crear la cuenta",
      };
    }

    // Respuesta exitosa
    return { success: true };
  } catch (error) {
    console.error("[registerService] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado. Intenta nuevamente.",
    };
  }
}
