'use client'

import { useQuery } from '@tanstack/react-query'
import { getMyConversations } from '@/features/chat/actions'

export function useConversations() {
  const { data: conversations = [], isLoading } = useQuery({
  queryKey: ['conversations'],
  queryFn: getMyConversations,
  refetchInterval: 23000,
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 5,
})

  return { conversations, loading: isLoading }
}