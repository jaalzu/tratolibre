// app/(main)/admin/reports/conversation/[id]/page.tsx
import { Box } from '@chakra-ui/react'
import { getAdminConversation } from '@/features/admin/actions'
import { redirect } from 'next/navigation'
import { ConversationHeader } from '@/features/admin/components/conversation/ConversationHeader'
import { ConversationMessages } from '@/features/admin/components/conversation/ConversationMessages'

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { conversation, messages } = await getAdminConversation(id)

  if (!conversation) redirect('/admin/reports')

  return (
    <>
      <ConversationHeader conversation={conversation} />
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={6}>
        <ConversationMessages messages={messages} buyerId={conversation.buyer_id} />
      </Box>
    </>
  )
}