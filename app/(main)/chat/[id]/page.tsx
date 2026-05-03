import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { getConversationById } from "@/features/chat/actions";
import { validateConversationData } from "@/features/chat/utils/conversation-guard";
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
  const validated = validateConversationData(conversation);

  if (!validated) {
    if (process.env.NODE_ENV === "development") {
      console.error("Invalid conversation data:", conversation);
    }
    redirect("/chat");
  }

  const isBuyer = validated.buyerId === user.id;
  const otherUser = isBuyer ? validated.seller : validated.buyer;
  const otherUserId = isBuyer ? validated.sellerId : validated.buyerId;

  return (
    <ChatDetailView
      conversationId={id}
      userId={user.id}
      item={validated.item}
      otherUser={{
        id: otherUserId,
        name: otherUser.name,
        avatar_url: otherUser.avatar_url ?? undefined,
      }}
    />
  );
}
