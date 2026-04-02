"use client";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { ConversationItem } from "./ConversationItem";
import { useChatStore } from "@/store/chatStore";
import { Conversation } from "@/features/chat/types";
import { useConversations } from "@/features/chat/hooks/useConversations";

interface ConversationListProps {
  activeId?: string;
  userId: string;
}
export const ConversationList = ({
  activeId,
  userId,
}: ConversationListProps) => {
  useConversations();
  const conversations = useChatStore((state) => state.conversations);
  const loading = useChatStore((state) => state.isLoading);

  return (
    <Flex
      direction="column"
      w={{ base: "full", md: "320px" }}
      flexShrink={0}
      borderRightWidth={{ base: "0", md: "2px" }}
      borderColor="neutral.100"
      h="full"
      overflow="hidden"
    >
      <Box px="4" py="5" borderBottom="1px solid" borderColor="neutral.100">
        <Text fontSize="md" fontWeight="bold" color="neutral.900">
          Bandeja de entrada
        </Text>
      </Box>

      <Box flex="1" overflowY="auto">
        {loading ? (
          <Stack gap={0}>
            {[...Array(6)].map((_, i) => (
              <Flex key={i} gap={3} align="center" px={4} py={3}>
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="xl"
                  bg="neutral.100"
                  flexShrink={0}
                />
                <Box flex="1">
                  <Box
                    w="70%"
                    h="13px"
                    bg="neutral.100"
                    borderRadius="md"
                    mb={1.5}
                  />
                  <Box w="50%" h="11px" bg="neutral.100" borderRadius="md" />
                </Box>
              </Flex>
            ))}
          </Stack>
        ) : conversations.length === 0 ? (
          <Flex h="full" align="center" justify="center">
            <Text fontSize="sm" color="neutral.400">
              No tenés conversaciones
            </Text>
          </Flex>
        ) : (
          <Stack gap="0">
            {conversations.map((conv: Conversation) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeId === conv.id}
                userId={userId}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Flex>
  );
};
