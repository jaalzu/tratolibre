"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import {
  fetchUserConversations,
  fetchUnreadMessages,
} from "@/features/chat/services/conversations.service";
import {
  mapUnreadMessagesToCountMap,
  mapConversationSummariesToExtended,
} from "@/features/chat/mappers/conversation.mapper";
import { type ConversationExtended } from "@/features/chat/schemas";

export async function getMyConversations(): Promise<ConversationExtended[]> {
  try {
    // 1. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) return [];

    // 2. Fetch data (parallel)
    const [conversationsResult, unreadResult] = await Promise.all([
      fetchUserConversations(supabase, user.id),
      fetchUnreadMessages(supabase, user.id),
    ]);

    // 3. Error handling
    if (conversationsResult.error) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Error fetching conversations:",
          conversationsResult.error,
        );
      }
      return [];
    }

    if (!conversationsResult.data?.length) return [];

    // 4. Mapeo de datos
    const unreadMap = mapUnreadMessagesToCountMap(unreadResult.data ?? []);
    const conversations = mapConversationSummariesToExtended(
      conversationsResult.data,
      unreadMap,
    );

    return conversations;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getMyConversations:", error);
    }
    return [];
  }
}
