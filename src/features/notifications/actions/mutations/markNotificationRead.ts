"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";

/**
 * Marcar una notificación específica como leída
 * @param id - ID de la notificación a marcar como leída
 * @returns true si se marcó exitosamente, false en caso de error
 */
export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return false;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[markNotificationRead] Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[markNotificationRead] Unexpected error:", error);
    return false;
  }
}
