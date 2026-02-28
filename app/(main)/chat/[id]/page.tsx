import { getMyConversations } from '@/features/chat/actions'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/chat/messages/ChatWindow'
import { ChatHeader } from '@/components/chat/header/ChatHeader'
import { ConversationList } from '@/components/chat/conversations/ConversationList'
import { Box, Flex } from '@chakra-ui/react'
import { redirect } from 'next/navigation'

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
  if (!conversation) redirect('/chat')

  const isBuyer = conversation.buyer_id === user?.id
  const seller = isBuyer ? conversation.seller : conversation.buyer

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
     <ChatWindow 
conversationId={id} 
  userId={user?.id!} 
/>
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
     <ChatWindow 
 conversationId={id} 
  userId={user?.id!} 
/>
          </Box>
        </Flex>
      </Box>
    </>
  )
}