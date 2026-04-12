"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { fetchConversationsByItem } from "@/features/chat/services/conversations.service";
import { mapConversationsWithBuyers } from "@/features/chat/mappers/conversation.mapper";
import { ItemIdSchema, type ConversationBuyer } from "@/features/chat/schemas";

export async function getConversationsByItem(
  itemId: string,
): Promise<ConversationBuyer[]> {
  try {
    // 1. Validación de input
    const validatedInput = ItemIdSchema.parse({ itemId });

    // 2. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) return [];

    // 3. Fetch
    const { data, error } = await fetchConversationsByItem(
      supabase,
      validatedInput.itemId,
      user.id,
    );

    // 4. Error handling
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching conversations by item:", error);
      }
      return [];
    }

    if (!data?.length) return [];

    // 5. Mapeo
    return mapConversationsWithBuyers(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getConversationsByItem:", error);
    }
    return [];
  }
}
