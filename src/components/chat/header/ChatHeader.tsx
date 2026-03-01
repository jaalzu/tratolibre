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
      isOtherOnline?: boolean
}
export const ChatHeader = ({ item, seller, conversationId }: ChatHeaderProps) => {
  if (!item) return null
  
    return (
  <Flex align="center" gap="3" px="3" py="2" bg="brand.default" position="sticky" top="0" zIndex={10}>
    
    {/* Flecha atrás */}
<NextLink href="/chat">
  <Box 
    display={{ base: 'block', md: 'none' }} 
    color="white" 
    cursor="pointer" 
    _hover={{ opacity: 0.7 }}
  >
    <i className="bx bx-arrow-back" style={{ fontSize: 'xl' }} />
  </Box>
</NextLink>

    {/* Foto del producto */}
    {item.images?.[0] && (
      <Box position="relative" w="10" h="10" borderRadius="sm" overflow="hidden" flexShrink={0}>
        <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
      </Box>
    )}

    {/* Info del producto  */}
   <Box flex="1" minW="0">
  <Text fontSize="md" fontWeight="medium" color="whiteAlpha.900" truncate>{item.title}</Text>
  <Text fontSize="md" color="whiteAlpha.900" fontWeight="bold">
    ${item.sale_price?.toLocaleString('es-AR')}
  </Text>
</Box>

    {/* Avatar vendedor con indicador online */}
<Box position="relative" w="9" h="9" flexShrink={0}>
  <Box position="relative" w="full" h="full" borderRadius="full" overflow="hidden" border="1px solid" borderColor="whiteAlpha.400">
    {seller.avatar_url ? (
      <Image src={seller.avatar_url} alt={seller.name} fill style={{ objectFit: 'cover' }} />
    ) : (
      <Flex w="full" h="full" bg="whiteAlpha.300" align="center" justify="center">
        <Text fontSize="xs" color="white" fontWeight="bold">{seller.name?.[0]?.toUpperCase()}</Text>
      </Flex>
    )}
  </Box>
 
</Box>

    {/* Menú */}
    <ChatMenu itemId={item.id} conversationId={conversationId} />
  </Flex>
)
}