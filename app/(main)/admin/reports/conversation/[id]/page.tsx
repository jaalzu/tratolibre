// app/(main)/admin/reports/conversation/[id]/page.tsx
import dynamic from "next/dynamic";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { getAdminConversation } from "@/features/admin/actions";
import { redirect } from "next/navigation";
import { ConversationHeader } from "@/features/admin/components/conversation/ConversationHeader";

const ConversationMessages = dynamic(
  () =>
    import("@/features/admin/components/conversation/ConversationMessages").then(
      (mod) => mod.ConversationMessages,
    ),
  {
    loading: () => (
      <Stack gap={4} p={5}>
        <Skeleton h="40px" w="70%" borderRadius="lg" />
        <Skeleton h="40px" w="60%" alignSelf="flex-end" borderRadius="lg" />
        <Skeleton h="40px" w="80%" borderRadius="lg" />
      </Stack>
    ),
  },
);

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { conversation, messages } = await getAdminConversation(id);

  if (!conversation) redirect("/admin/reports");

  return (
    <>
      <ConversationHeader conversation={conversation} />
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={6}>
        <ConversationMessages
          messages={messages}
          buyerId={conversation.buyer_id}
        />
      </Box>
    </>
  );
}
