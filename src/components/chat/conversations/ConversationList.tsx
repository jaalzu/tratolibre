'use client'

import { Stack } from '@chakra-ui/react'
import { ConversationItem } from './ConversationItem'
import { Card } from '@/components/ui/Card'
import { Conversation } from '@/features/chat/types'

interface ConversationListProps {
  conversations: Conversation[]
  activeId?: string
}

export const ConversationList = ({ conversations, activeId }: ConversationListProps) => (
  <Card p="0" overflowY="auto" borderColor="neutral.100" borderRadius="lg" shadow="base">
    <Stack gap="0">
      {conversations.map(conv => (
        <ConversationItem key={conv.id} conv={conv} isActive={activeId === conv.id} />
      ))}
    </Stack>
  </Card>
)