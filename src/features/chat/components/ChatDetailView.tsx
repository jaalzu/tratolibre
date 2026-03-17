import { Box, Flex } from "@chakra-ui/react";
import { ConversationList } from "./conversations/ConversationList";
import { ChatHeader } from "./header/ChatHeader";
import { ChatWindow } from "./messages/ChatWindow";
import { ChatLayout } from "./ChatLayout";

interface ChatDetailViewProps {
  conversationId: string;
  userId: string;
  item: { id: string; title: string; images: string[]; sale_price: number };
  otherUser: { id: string; name: string; avatar_url?: string };
}

export function ChatDetailView({
  conversationId,
  userId,
  item,
  otherUser,
}: ChatDetailViewProps) {
  return (
    <ChatLayout
      mobile={
        <>
          <Box flexShrink={0}>
            <ChatHeader
              item={item}
              seller={otherUser}
              conversationId={conversationId}
            />
          </Box>
          <Box
            flex="1"
            minH="0"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <ChatWindow conversationId={conversationId} userId={userId} />
          </Box>
        </>
      }
      desktop={
        <>
          <ConversationList activeId={conversationId} userId={userId} />
          <Flex direction="column" flex="1" minW="0">
            <ChatHeader
              item={item}
              seller={otherUser}
              conversationId={conversationId}
            />
            <Box flex="1" minH="0">
              <ChatWindow conversationId={conversationId} userId={userId} />
            </Box>
          </Flex>
        </>
      }
    />
  );
}
