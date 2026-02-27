'use client'

import { Flex, Spinner, Text, Box} from '@chakra-ui/react'
import { useChat } from '@/features/chat/useChat'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ChatHeader } from '../header/ChatHeader'

interface ChatWindowProps {
  conversationId: string
  userId: string
  type?: string
  item?: any
  seller?: any
}

export const ChatWindow = ({ conversationId, userId, type, item, seller }: ChatWindowProps) => {
  const { messages, loading, input, setInput, sending, sendMessage, bottomRef, isOtherOnline, isOtherTyping } = useChat(conversationId, userId, type)

  if (loading) {
    return (
      <Flex p="8" justify="center" align="center" direction="column" gap="2">
        <Spinner color="brand.default" size="sm" />
        <Text fontSize="xs" color="neutral.400">Cargando mensajes...</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" h="full" bg="white" overflow="hidden">
      <ChatHeader 
        item={item} 
        seller={seller} 
        conversationId={conversationId}
        isOtherOnline={isOtherOnline}
      />
      <Box flex="1" minH="0" overflowY="auto">
        <ChatMessages messages={messages} userId={userId} bottomRef={bottomRef} isOtherTyping={isOtherTyping} />
      </Box>
      <Box flexShrink={0}>
        <ChatInput value={input} onChange={setInput} onSend={sendMessage} sending={sending} />
      </Box>
    </Flex>
  )
}