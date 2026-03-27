"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";

export async function markMessagesAsRead(conversationId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("read", false);
}
