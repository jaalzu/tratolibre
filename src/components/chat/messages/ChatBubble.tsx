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

export const ChatBubble = ({ content, isMine, senderInitial, createdAt }: ChatBubbleProps) => (
  <Flex gap="2" flexDirection={isMine ? 'row-reverse' : 'row'} alignItems="flex-end">
    <Flex
      w="7" h="7" borderRadius="full" flexShrink={0}
      bg={isMine ? "brand.default" : "neutral.200"}
      color={isMine ? "white" : "neutral.700"}
      align="center" justify="center"
      fontSize="xs" fontWeight="bold"
    >
      {senderInitial ?? '?'}
    </Flex>

    <Flex direction="column" gap="0.5" alignItems={isMine ? 'flex-end' : 'flex-start'}>
      <Box
        maxW="75%" px="3" py="2"
        borderRadius="2xl"
        bg={isMine ? "brand.default" : "neutral.100"}
        color={isMine ? "white" : "neutral.900"}
        borderBottomRightRadius={isMine ? "xs" : "2xl"}
        borderBottomLeftRadius={isMine ? "2xl" : "xs"}
        fontSize="sm"
      >
        {content}
      </Box>
      <Text fontSize="2xs" color="neutral.400" px="1">{formatTime(createdAt)}</Text>
    </Flex>
  </Flex>
)