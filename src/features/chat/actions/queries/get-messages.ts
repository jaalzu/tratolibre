"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { fetchMessages } from "@/features/chat/services/messages.service";
import { mapMessagesToWithProfile } from "@/features/chat/mappers/message.mapper";
import {
  ConversationIdSchema,
  type MessageWithProfile,
} from "@/features/chat/schemas";

export async function getMessages(
  conversationId: string,
): Promise<MessageWithProfile[]> {
  try {
    // 1. Validación de input
    const validatedInput = ConversationIdSchema.parse({ conversationId });

    // 2. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) return [];

    // 3. Fetch
    const { data, error } = await fetchMessages(
      supabase,
      validatedInput.conversationId,
    );

    // 4. Error handling
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching messages:", error);
      }
      return [];
    }

    if (!data?.length) return [];

    // 5. Mapeo
    return mapMessagesToWithProfile(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getMessages:", error);
    }
    return [];
  }
}
