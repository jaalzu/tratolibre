import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getConversationById } from "@/features/chat/actions";
import { ChatDetailView } from "@/features/chat/components/ChatDetailView";
import { redirect } from "next/navigation";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  const conversation = await getConversationById(id);
  if (!conversation) redirect("/chat");

  const isBuyer = conversation.buyer_id === user.id;
  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  const otherUserId = isBuyer ? conversation.seller_id : conversation.buyer_id;

  return (
    <ChatDetailView
      conversationId={id}
      userId={user.id}
      item={{ id: conversation.item_id, ...conversation.items }}
      otherUser={{ ...otherUser, id: otherUserId }}
    />
  );
}
