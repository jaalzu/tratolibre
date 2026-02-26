import { getMyConversations } from '@/features/chat/actions'
import { createClient } from '@/lib/supabase/server'
import { ConversationList } from '@/components/chat/conversations/ConversationList'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const conversations = await getMyConversations()

  return (
    <PageContainer py="8">
      <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb="6">
        Mensajes
      </Heading>

      {conversations.length === 0 ? (
        <Text color="neutral.400" fontSize="sm">No tenés conversaciones todavía</Text>
      ) : (
        <>
          {/* Mobile — solo lista */}
          <Box display={{ base: 'block', md: 'none' }}>
            <ConversationList conversations={conversations} userId={user?.id!} />
          </Box>

          {/* Desktop — lista + panel vacío */}
          <Grid display={{ base: 'none', md: 'grid' }} templateColumns="1fr 2fr" gap="6" h="600px">
            <ConversationList conversations={conversations} userId={user?.id!} />
            <Flex h="full" align="center" justify="center" color="neutral.400" fontSize="sm" border="1px dashed" borderColor="neutral.100" borderRadius="lg">
              Seleccioná una conversación
            </Flex>
          </Grid>
        </>
      )}
    </PageContainer>
  )
}