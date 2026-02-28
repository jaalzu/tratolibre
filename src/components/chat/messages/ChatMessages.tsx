'use client'

import { Box, Stack, Flex, Text } from '@chakra-ui/react'
import { ChatBubble } from './ChatBubble'
import { ChatDateDivider } from './ChatDateDivider'
import { ChatSecurityNote } from './ChatSecurityNote'
import { Message } from '@/features/chat/types'

interface ChatMessagesProps {
  messages: Message[]
  userId: string
  bottomRef: React.RefObject<HTMLDivElement | null>
  isOtherTyping?: boolean
}

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
}

export const ChatMessages = ({ messages, userId, bottomRef, isOtherTyping }: ChatMessagesProps) => (
  <Box flex="1" overflowY="auto" px="4" py="2">
    <ChatSecurityNote />
    <Stack gap="2">
      {messages.map((msg, i) => {
        const showDate = i === 0 || !isSameDay(messages[i - 1].created_at, msg.created_at)
        return (
          <Box key={msg.id}>
            {showDate && <ChatDateDivider date={msg.created_at} />}
            <ChatBubble
              content={msg.content}
              isMine={msg.sender_id === userId}
              senderInitial={msg.profiles?.name?.[0]?.toUpperCase()}
              createdAt={msg.created_at}
            />
          </Box>
        )
      })}

      {isOtherTyping && (
        <Flex align="center" gap="2" px="2">
          <Text fontSize="xs" color="neutral.400" fontStyle="italic">
            Escribiendo...
          </Text>
        </Flex>
      )}
      <div ref={bottomRef} />
    </Stack>
  </Box>
)