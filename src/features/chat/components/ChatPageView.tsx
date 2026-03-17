import { Flex, Text } from "@chakra-ui/react";
import { ConversationList } from "./conversations/ConversationList";
import { ChatLayout } from "./ChatLayout";

interface ChatPageViewProps {
  userId: string;
}

export function ChatPageView({ userId }: ChatPageViewProps) {
  return (
    <ChatLayout
      mobileH="calc(100dvh - 120px)"
      mobile={<ConversationList userId={userId} />}
      desktop={
        <>
          <ConversationList userId={userId} />
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
        </>
      }
    />
  );
}
