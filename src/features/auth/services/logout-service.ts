// features/auth/services/logout.service.ts

import { createClient } from "@/lib/supabase/server";

/**
 * Service: Cerrar sesión
 *
 * @returns void (siempre exitoso, errores solo se loguean)
 */
export async function logoutService(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    // Logout nunca falla para el usuario
    console.error("[logoutService] Error al cerrar sesión:", error);
  }
}
