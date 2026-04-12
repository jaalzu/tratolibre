"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { countUnreadMessages } from "@/features/chat/services/messages.service";

export async function getTotalUnreadCount(): Promise<number> {
  try {
    // 1. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) return 0;

    // 2. Fetch
    const { count, error } = await countUnreadMessages(supabase, user.id);

    // 3. Error handling
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching unread count:", error);
      }
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getTotalUnreadCount:", error);
    }
    return 0;
  }
}
