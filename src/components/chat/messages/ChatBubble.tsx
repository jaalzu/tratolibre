'use client'

import { Box, Flex, Text } from '@chakra-ui/react'

interface ChatBubbleProps {
  content: string
  isMine: boolean
  senderInitial?: string
  createdAt: string
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ChatBubble = ({ content, isMine, createdAt }: ChatBubbleProps) => (
  <Flex justifyContent={isMine ? 'flex-end' : 'flex-start'}>
    <Box
      maxW="75%"
      px="3" py="1"
      borderRadius="full"
      bg={isMine ? 'neutral.100' : 'white'}
      border="1px solid"
      borderColor="neutral.100"
    >
      <Text fontSize="sm" color="neutral.900" display="inline" mr="3">
        {content}
      </Text>
      <Text fontSize="2xs" color="neutral.400" display="inline" whiteSpace="nowrap">
        {formatTime(createdAt)}
      </Text>
    </Box>
  </Flex>
)