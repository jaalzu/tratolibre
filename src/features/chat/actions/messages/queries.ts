"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";

export async function markMessagesAsRead(conversationId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("read", false);

  // No queremos bloquear al usuario si falla, pero sí loggear
  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error marking messages as read:", error);
    }
    return { error: mapSupabaseError(error) };
  }

  return { success: true };
}
