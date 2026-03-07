import { getConversationById } from '@/features/chat/actions'
import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { ChatWindow } from '@/features/chat/components/messages/ChatWindow'
import { ChatHeader } from '@/features/chat/components/header/ChatHeader'
import { ConversationList } from '@/features/chat/components/conversations/ConversationList'
import { Box, Flex } from '@chakra-ui/react'
import { redirect } from 'next/navigation'

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user } = await getAuthUser()

  if (!user) redirect('/login')

  const conversation = await getConversationById(id)
  if (!conversation) redirect('/chat')

  const isBuyer = conversation.buyer_id === user.id
  const seller  = isBuyer ? conversation.seller : conversation.buyer

  return (
    <>
      {/* Mobile */}
      <Box display={{ base: 'flex', md: 'none' }} flexDirection="column" h="100dvh" overflow="hidden">
        <Box flexShrink={0}>
          <ChatHeader
            item={{ id: conversation.item_id, ...conversation.items }}
            seller={seller}
            conversationId={id}
          />
        </Box>
        <Box flex="1" minH="0" display="flex" flexDirection="column" overflow="hidden">
          <ChatWindow conversationId={id} userId={user.id} />
        </Box>
      </Box>

      {/* Desktop */}
      <Box display={{ base: 'none', md: 'flex' }} h="calc(100dvh - 90px)" overflow="hidden">
        <ConversationList activeId={id} />
        <Flex direction="column" flex="1" minW="0">
          <ChatHeader
            item={{ id: conversation.item_id, ...conversation.items }}
            seller={seller}
            conversationId={id}
          />
          <Box flex="1" minH="0">
            <ChatWindow conversationId={id} userId={user.id} />
          </Box>
        </Flex>
      </Box>
    </>
  )
}