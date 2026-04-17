// features/auth/services/login.service.ts

import { createClient } from "@/lib/supabase/server";
import { mapSupabaseUserToAppUser } from "../mappers";
import type { LoginServerInput, LoginResponse } from "../schemas";

/**
 * Service: Login con email y password
 *
 * @param input - Credenciales validadas por el schema
 * @returns LoginResponse con success/error
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

    // Manejo de errores
    if (error) {
      // Errores específicos de Supabase
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Email o contraseña incorrectos",
        };
      }

      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Debes verificar tu email antes de iniciar sesión",
        };
      }

      // Error genérico
      return {
        success: false,
        error: "Error al iniciar sesión. Intenta nuevamente.",
      };
    }

    //  Validar que tenemos usuario
    if (!data.user) {
      return {
        success: false,
        error: "No se pudo obtener la información del usuario",
      };
    }

    //  mmapear usuario desupabase a AppUser
    const appUser = mapSupabaseUserToAppUser(data.user);

    //  exitoo
    return {
      success: true,
      user: {
        id: appUser.id,
        email: appUser.email,
      },
    };
  } catch (error) {
    //errores inesperados (red, etc)
    console.error("[loginService] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado. Intenta nuevamente.",
    };
  }
}
