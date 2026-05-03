import { createClient } from "@/lib/supabase/client/server";

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
    console.error("[logoutService] Error al cerrar sesión:", error);
  }
}
