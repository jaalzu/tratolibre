"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";

/**
 * Marcar todas las notificaciones del usuario como leídas
 * @returns true si se marcaron exitosamente, false en caso de error
 */
export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return false;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("[markAllNotificationsRead] Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[markAllNotificationsRead] Unexpected error:", error);
    return false;
  }
}
