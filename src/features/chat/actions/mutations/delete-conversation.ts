"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { deleteConversation } from "@/features/chat/services/conversations.service";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import {
  ConversationIdSchema,
  type ActionResponse,
} from "@/features/chat/schemas";

export async function deleteConversationAction(
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

    // 3. Delete
    const { error } = await deleteConversation(
      supabase,
      validatedInput.conversationId,
      user.id,
    );

    // 4. Error handling
    if (error) {
      return { error: mapSupabaseError(error) };
    }

    // 5. Revalidación
    revalidatePath("/chat", "layout");

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in deleteConversationAction:", error);
    }
    return { error: "Error inesperado al eliminar la conversación" };
  }
}
