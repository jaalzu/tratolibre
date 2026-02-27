'use client'

import { useQuery } from '@tanstack/react-query'
import { getMyConversations } from '@/features/chat/actions'

export function useConversations() {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getMyConversations,
    refetchInterval: 35000,
  })

  return { conversations, loading: isLoading }
}