'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { Conversation } from '@/features/chat/types'

interface ConversationItemProps {
  conv: Conversation & { messages?: { content: string; created_at: string }[] }
  isActive?: boolean
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}



export const ConversationItem = ({ conv,isActive }: ConversationItemProps) => {
const lastMessage = (conv as any).lastMessage

  return (
    <Box
      asChild
      borderBottom="1px solid"
      borderColor="neutral.100"
      bg={isActive ? "brand.50" : "transparent"}
      _hover={{ bg: "neutral.50" }}
      transition="background 0.2s"
    >
      <NextLink href={`/chat/${conv.id}`}>
        <Flex align="center" gap="3" px="4" py="3">
          {/* Foto del artículo */}
          <Box position="relative" w="14" h="14" borderRadius="lg" overflow="hidden" flexShrink={0} bg="neutral.100">
            {conv.items?.images?.[0] ? (
              <Image src={conv.items.images[0]} alt={conv.items.title} fill style={{ objectFit: 'cover' }} />
            ) : (
              <Flex w="full" h="full" align="center" justify="center">
                <Text fontSize="xl">📦</Text>
              </Flex>
            )}
          </Box>

          {/* Info */}
          <Box flex="1" minW="0">
            <Flex justify="space-between" align="center" mb="0.5">
              <Text fontSize="sm" fontWeight="bold" color="neutral.900" truncate>
                {conv.items?.title}
              </Text>
              {lastMessage && (
                <Text fontSize="2xs" color="neutral.400" flexShrink={0} ml="2">
                  {formatTime(lastMessage.created_at)}
                </Text>
              )}
            </Flex>
            <Text fontSize="xs" color="brand.default" fontWeight="medium" mb="0.5">
              ${conv.items?.sale_price?.toLocaleString('es-AR')}
            </Text>
            <Text fontSize="xs" color="neutral.400" truncate>
              {lastMessage?.content ?? 'Sin mensajes aún'}
            </Text>
          </Box>
        </Flex>
      </NextLink>
    </Box>
  )
}