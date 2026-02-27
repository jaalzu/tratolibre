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
      p={1}
      borderBottom="1px solid"
      borderColor="neutral.300"
      bg={isActive ? 'accent.100' : 'transparent'}
    >
      <NextLink href={`/chat/${conv.id}`}>
       <Flex align="center"   gap="2" px="3" py="2">
  {/* Foto del artículo */}
  <Box position="relative"  w="12" h="12" borderRadius="sm" overflow="hidden" flexShrink={0} bg="neutral.100">
{conv.items?.images?.[0] ? (
  <Image 
    src={conv.items.images[0]} 
    alt={conv.items.title ?? ''} 
    fill 
    style={{ objectFit: 'cover' }} 
  />
) : (
  <Box 
    w="full" 
    h="full" 
    bg="gray.200" 
    borderRadius="md" // Ajusta el radio según tu diseño
  />
)}
  </Box>

  {/* Info */}
  <Box flex="1" minW="0">
    <Text fontSize="xs" color="neutral.400" >
      {conv.buyer?.name ?? conv.seller?.name}
    </Text>
    <Text fontSize="md" fontWeight="bold" color="neutral.800" truncate>
      {conv.items?.title}
    </Text>
    {lastMessage && (
      <Text fontSize="xs" color="neutral.500" truncate mt="1">
        {lastMessage.content}
      </Text>
    )}
  </Box>

  {/* Hora + Badge */}
  <Flex direction="column" align="flex-end" gap="1" flexShrink={0}>
    {lastMessage && (
      <Text fontSize="xs" color="neutral.400">
        {formatTime(lastMessage.created_at)}
      </Text>
    )}
    {conv.hasUnread && (
      <Flex w="4" h="4" borderRadius="full" bg="brand.default" align="center" justify="center">
        <Text fontSize="xs" color="white" fontWeight="bold">
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