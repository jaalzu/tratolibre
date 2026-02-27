'use client'

import { Box, Flex, Text } from '@chakra-ui/react'

interface ChatBubbleProps {
  content: string
  isMine: boolean
  senderInitial?: string
  createdAt: string
}

function renderContent(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = content.split(urlRegex)

  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a 
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline', wordBreak: 'break-all' }}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
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
      px="2" py="1"
      borderRadius="full"
      bg={isMine ? 'neutral.100' : 'white'}
      border="1px solid"
      borderColor="neutral.100"
    >
      <Text fontSize="xs" color="neutral.900" display="inline" mr="3">
        {renderContent(content)}
      </Text>
      <Text fontSize="2xs" color="neutral.400" display="inline" whiteSpace="nowrap">
        {formatTime(createdAt)}
      </Text>
    </Box>
  </Flex>
)