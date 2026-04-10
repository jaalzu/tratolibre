"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";

/**
 * Obtener el conteo de notificaciones no leídas del usuario autenticado
 * @returns Número de notificaciones no leídas
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("[getUnreadCount] Error:", error.message);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error("[getUnreadCount] Unexpected error:", error);
    return 0;
  }
}
