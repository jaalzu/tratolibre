import { ConversationList } from '@/components/chat/conversations/ConversationList'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'

export default async function ChatPage() {
  return (
    <>
      {/* Mobile */}
      <Box display={{ base: 'flex', md: 'none' }} flexDirection="column" h="calc(100dvh - 120px)" overflow="hidden">
        <ConversationList />
      </Box>

      {/* Desktop */}
      <Box display={{ base: 'none', md: 'flex' }} h="calc(100dvh - 90px)" overflow="hidden">
        <ConversationList />
        <Flex h="full" align="center" justify="center" flex="1" color="neutral.400" fontSize="sm" borderLeft="1px solid" borderColor="neutral.100">
          Seleccioná una conversación
        </Flex>
      </Box>
    </>
  )
}