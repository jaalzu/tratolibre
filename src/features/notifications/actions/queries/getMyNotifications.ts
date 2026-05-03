"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import type { Notification } from "../../types";

/**
 * Obtener notificaciones del usuario autenticado
 * @returns Array de notificaciones ordenadas por fecha (más recientes primero)
 */
export async function getMyNotifications(): Promise<Notification[]> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[getMyNotifications] Error:", error.message);
      return [];
    }

    return (data ?? []) as Notification[];
  } catch (error) {
    console.error("[getMyNotifications] Unexpected error:", error);
    return [];
  }
}
