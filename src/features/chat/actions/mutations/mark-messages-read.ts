"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { markConversationMessagesAsRead } from "@/features/chat/services/messages.service";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import {
  ConversationIdSchema,
  type ActionResponse,
} from "@/features/chat/schemas";

export async function markMessagesAsRead(
  conversationId: string,
): Promise<ActionResponse> {
  try {
    // 1. Validación de input
    const validatedInput = ConversationIdSchema.parse({ conversationId });

    // 2. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    // 3. Marcar como leídos
    const { error } = await markConversationMessagesAsRead(
      supabase,
      validatedInput.conversationId,
      user.id,
    );

    // 4. Error handling (no bloqueante)
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error marking messages as read:", error);
      }
      return { error: mapSupabaseError(error) };
    }

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in markMessagesAsRead:", error);
    }
    return { error: "Error inesperado al marcar mensajes como leídos" };
  }
}
