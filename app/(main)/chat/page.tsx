import { ConversationList } from "@/features/chat/components/conversations/ConversationList";
import { Box, Flex } from "@chakra-ui/react";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <>
      {/* Mobile */}
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        h="calc(100dvh - 120px)"
        overflow="hidden"
      >
        <ConversationList userId={user.id} />
      </Box>

      {/* Desktop */}
      <Box
        display={{ base: "none", md: "flex" }}
        h="calc(100dvh - 90px)"
        overflow="hidden"
      >
        <ConversationList userId={user.id} />
        <Flex
          h="full"
          align="center"
          justify="center"
          flex="1"
          color="neutral.400"
          fontSize="sm"
          borderLeft="1px solid"
          borderColor="neutral.100"
        >
          Seleccioná una conversación
        </Flex>
      </Box>
    </>
  );
}
