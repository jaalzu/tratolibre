import { Box, Flex, Text, Heading } from '@chakra-ui/react'
import NextLink from 'next/link'

interface ConversationHeaderProps {
  conversation: {
    buyer?: { name?: string } | null
    seller?: { name?: string } | null
    items?: { title?: string } | null
  }
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  return (
    <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={6} mb={3}>
      <Box asChild>
        <NextLink href="/admin/reports">
          <Flex align="center" gap={2} color="neutral.700" _hover={{ color: 'fg' }} transition="color 0.15s" mb={4}>
            <i className="bx bx-arrow-back" style={{ fontSize: '24px', color: 'var(--chakra-colors-neutral-800)' }} />
            <Text fontSize="sm">Volver a reportes</Text>
          </Flex>
        </NextLink>
      </Box>
      <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="fg" mb={3}>
        Conversación reportada
      </Heading>
      <Flex gap={3} flexWrap="wrap" align="center">
        <Flex align="center" gap={1.5} bg="accent.subtle" px={3} py={1} borderRadius="full">
          <Box w={2} h={2} borderRadius="full" bg="accent.default" />
          <Text fontSize="sm" color="accent.fg" fontWeight="medium">
            Comprador: {conversation.buyer?.name ?? 'desconocido'}
          </Text>
        </Flex>
        <Flex align="center" gap={1.5} bg="secondary.subtle" px={3} py={1} borderRadius="full">
          <Box w={2} h={2} borderRadius="full" bg="secondary.default" />
          <Text fontSize="sm" color="secondary.fg" fontWeight="medium">
            Vendedor: {conversation.seller?.name ?? 'desconocido'}
          </Text>
        </Flex>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" fontWeight="bold" color="fg">Artículo: </Text>
          {conversation.items?.title ?? 'desconocido'}
        </Text>
      </Flex>
    </Box>
  )
}