import { getMyConversations } from '@/features/chat/actions'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/chat/messages/ChatWindow'
import { ChatHeader } from '@/components/chat/header/ChatHeader'
import { ConversationList } from '@/components/chat/conversations/ConversationList'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { notFound } from 'next/navigation'

export default async function ChatDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = await params
  const { type } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const conversations = await getMyConversations()

  const conversation = conversations.find((c: any) => c.id === id)
  if (!conversation) notFound()

  const isBuyer = conversation.buyer_id === user?.id
  const seller = isBuyer ? conversation.seller : conversation.buyer

  return (
    <>
      {/* Mobile */}
<Box display={{ base: 'flex', md: 'none' }} flexDirection="column" h="100dvh" overflow="hidden">
  {/* Header fijo */}
  <Box flexShrink={0}>
    <ChatHeader
      item={{ id: conversation.item_id, ...conversation.items }}
      seller={seller}
      conversationId={id}
    />
  </Box>

  {/* Chat — ocupa el espacio restante con scroll solo en mensajes */}
  <Box flex="1" minH="0" display="flex" flexDirection="column" overflow="hidden">
    <ChatWindow conversationId={id} userId={user?.id!} type={type} />
  </Box>
</Box>

      {/* Desktop */}
      <PageContainer py="8" display={{ base: 'none', md: 'block' }}>
        <Grid templateColumns="1fr 2fr" gap="6" h="600px">
          <ConversationList conversations={conversations}  activeId={id} />
          <Flex direction="column" h="full">
            <ChatHeader
              item={{ id: conversation.item_id, ...conversation.items }}
              seller={seller}
              conversationId={id}
            />
            <Box flex="1" minH="0">
              <ChatWindow conversationId={id} userId={user?.id!} type={type} />
            </Box>
          </Flex>
        </Grid>
      </PageContainer>
    </>
  )
}