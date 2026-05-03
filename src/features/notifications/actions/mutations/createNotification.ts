"use server";

import { createAdminClient } from "@/lib/supabase/client/admin";

import type { NotificationType } from "../../types";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  data: Record<string, unknown>;
}

/**
 * Crear una nueva notificación para un usuario
 * @param params - Parámetros de la notificación (userId, type, data)
 * @returns true si se creó exitosamente, false en caso de error
 */
export async function createNotification({
  userId,
  type,
  data,
}: CreateNotificationParams): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("notifications")
      .insert({ user_id: userId, type, data });

    if (error) {
      console.error("[createNotification] Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[createNotification] Unexpected error:", error);
    return false;
  }
}
