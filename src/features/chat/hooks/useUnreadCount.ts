'use client'

import { useQuery } from '@tanstack/react-query'
import { getMyConversations } from '@/features/chat/actions'

export function useUnreadCount(userId?: string): number {
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: getMyConversations,
    enabled: !!userId,
    refetchOnWindowFocus: true,  // refresca al volver al tab
    refetchInterval: 60000,      // cada 60s
    staleTime: 55000,
  })

  return conversations.reduce((acc, conv) => acc + (conv.unreadCount ?? 0), 0)
}