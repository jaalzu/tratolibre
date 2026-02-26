'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { Conversation } from '@/features/chat/types'

interface ConversationItemProps {
  conv: Conversation
  isActive?: boolean
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ConversationItem = ({ conv, isActive }: ConversationItemProps) => {
  const lastMessage = conv.lastMessage

  return (
    <Box
      asChild
      borderBottom="1px solid"
      borderColor="neutral.100"
      bg={isActive ? 'brand.50' : 'transparent'}
      _hover={{ bg: 'neutral.50' }}
      transition="background 0.2s"
    >
      <NextLink href={`/chat/${conv.id}`}>
       <Flex align="flex-start" gap="3" px="4" py="3">
  {/* Foto del artículo */}
  <Box position="relative" w="14" h="14" borderRadius="md" overflow="hidden" flexShrink={0} bg="neutral.100">
    {conv.items?.images?.[0] ? (
      <Image src={conv.items.images[0]} alt={conv.items.title ?? ''} fill style={{ objectFit: 'cover' }} />
    ) : (
      <Flex w="full" h="full" align="center" justify="center">
        <Text fontSize="lg">📦</Text>
      </Flex>
    )}
  </Box>

  {/* Info */}
  <Box flex="1" minW="0">
    <Text fontSize="2xs" color="neutral.400" mb="0.5">
      {conv.buyer?.name ?? conv.seller?.name}
    </Text>
    <Text fontSize="sm" fontWeight="bold" color="neutral.900" truncate>
      {conv.items?.title}
    </Text>
    {lastMessage && (
      <Text fontSize="xs" color="neutral.400" truncate mt="0.5">
        {lastMessage.content}
      </Text>
    )}
  </Box>

  {/* Hora + Badge */}
  <Flex direction="column" align="flex-end" gap="1" flexShrink={0}>
    {lastMessage && (
      <Text fontSize="2xs" color="neutral.400">
        {formatTime(lastMessage.created_at)}
      </Text>
    )}
    {conv.hasUnread && (
      <Flex w="5" h="5" borderRadius="full" bg="brand.default" align="center" justify="center">
        <Text fontSize="2xs" color="white" fontWeight="bold">
          {(conv as any).unreadCount > 9 ? '9+' : (conv as any).unreadCount}
        </Text>
      </Flex>
    )}
  </Flex>
</Flex>
      </NextLink>
    </Box>
  )
}