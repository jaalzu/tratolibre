'use client'

import { Box, Flex, Stack, Text, Spinner } from '@chakra-ui/react'
import { ConversationItem } from './ConversationItem'
import { useConversations } from '@/features/chat/useConversations'

interface ConversationListProps {
  activeId?: string
}

export const ConversationList = ({ activeId }: ConversationListProps) => {
  const { conversations, loading } = useConversations()

  return (
   <Flex 
  direction="column" 
  w={{ base: 'full', md: '320px' }} 
  flexShrink={0} 
  borderRight={{ base: 'none', md: '1px solid' }}
  borderColor="neutral.100" 
  h="full" 
  overflow="hidden"
>
      {/* Header */}
      <Box px="4" py="3" borderBottom="1px solid" borderColor="neutral.100">
        <Text fontSize="sm" fontWeight="bold" color="neutral.900">Bandeja de entrada</Text>
      </Box>

      {/* Lista */}
      <Box flex="1" overflowY="auto">
        {loading ? (
          <Flex h="full" align="center" justify="center">
            <Spinner size="sm" color="brand.default" />
          </Flex>
        ) : conversations.length === 0 ? (
          <Flex h="full" align="center" justify="center">
            <Text fontSize="sm" color="neutral.400">No tenés conversaciones</Text>
          </Flex>
        ) : (
          <Stack gap="0">
            {conversations.map((conv: any) => (
              <ConversationItem key={conv.id} conv={conv} isActive={activeId === conv.id} />
            ))}
          </Stack>
        )}
      </Box>
    </Flex>
  )
}