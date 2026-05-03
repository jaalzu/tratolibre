import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { ChatPageView } from "@/features/chat/components/ChatPageView";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  return <ChatPageView userId={user.id} />;
}
