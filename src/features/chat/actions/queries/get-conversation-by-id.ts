"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { fetchConversationById } from "@/features/chat/services/conversations.service";
import { mapConversationSummaryToExtended } from "@/features/chat/mappers/conversation.mapper";
import {
  ConversationIdSchema,
  type ConversationExtended,
} from "@/features/chat/schemas";

export async function getConversationById(
  id: string,
): Promise<ConversationExtended | null> {
  try {
    const validatedInput = ConversationIdSchema.parse({ conversationId: id });

    const { supabase, user } = await getAuthUser();
    if (!user) return null;

    const { data, error } = await fetchConversationById(
      supabase,
      validatedInput.conversationId,
      user.id,
    );

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching conversation:", error);
      }
      return null;
    }

    if (!data) return null;

    return mapConversationSummaryToExtended(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getConversationById:", error);
    }
    return null;
  }
}
