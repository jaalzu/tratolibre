'use client'

import { Flex, Spinner, Text, Box } from '@chakra-ui/react'
import { useChat } from '@/features/chat/useChat'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

interface ChatWindowProps {
  conversationId: string
  userId: string
}

export const ChatWindow = ({ conversationId, userId }: ChatWindowProps) => {
  const { messages, loading, input, setInput, sending, sendMessage, bottomRef, isOtherTyping } = useChat(conversationId, userId )

  if (loading) {
    return (
      <Flex p="8" justify="center" align="center" direction="column" gap="2">
        <Spinner color="brand.default" size="lg" />
        <Text fontSize="lg" color="neutral.500">Cargando mensajes...</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" h="full" bg="white" overflow="hidden">
      <Box flex="1" minH="0" overflowY="auto">
        <ChatMessages
          messages={messages}
          userId={userId}
          bottomRef={bottomRef}
          isOtherTyping={isOtherTyping}
        />
      </Box>
      <Box flexShrink={0}>
        <ChatInput value={input} onChange={setInput} onSend={sendMessage} sending={sending} />
      </Box>
    </Flex>
  )
}