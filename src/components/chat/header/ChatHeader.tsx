'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { ChatMenu } from './ChatMenu'
import 'boxicons/css/boxicons.min.css'

interface ChatHeaderProps {
  item: {
    id: string
    title: string
    images: string[]
    sale_price: number
  }
  seller: {
    name: string
    avatar_url?: string
  }
  conversationId: string
}

export const ChatHeader = ({ item, seller, conversationId }: ChatHeaderProps) => (
  <Flex
    align="center" gap="3" px="4" py="3"
    bg="brand.default"
    position="sticky" top="0" zIndex={10}
  >
    {/* Flecha atrás */}
    <NextLink href="/chat">
      <Box color="white" cursor="pointer" _hover={{ opacity: 0.8 }}>
        <i className="bx bx-arrow-back" style={{ fontSize: '22px' }} />
      </Box>
    </NextLink>

    {/* Foto del producto */}
    {item.images?.[0] && (
      <Box position="relative" w="9" h="9" borderRadius="md" overflow="hidden" flexShrink={0}>
        <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
      </Box>
    )}

    {/* Info del producto */}
    <Box flex="1" minW="0">
      <Text fontSize="sm" fontWeight="bold" color="white" truncate>{item.title}</Text>
      <Text fontSize="xs" color="whiteAlpha.800" fontWeight="medium">
        ${item.sale_price?.toLocaleString('es-AR')}
      </Text>
    </Box>

    {/* Avatar vendedor */}
    <Box position="relative" w="8" h="8" borderRadius="full" overflow="hidden" flexShrink={0} border="2px solid" borderColor="whiteAlpha.400">
      {seller.avatar_url ? (
        <Image src={seller.avatar_url} alt={seller.name} fill style={{ objectFit: 'cover' }} />
      ) : (
        <Flex w="full" h="full" bg="whiteAlpha.300" align="center" justify="center">
          <Text fontSize="xs" color="white" fontWeight="bold">{seller.name?.[0]?.toUpperCase()}</Text>
        </Flex>
      )}
    </Box>

    {/* Menú */}
    <ChatMenu itemId={item.id} conversationId={conversationId} />
  </Flex>
)