'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateConversation } from '@/features/chat/actions'

export function useStartChat() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const startChat = async (itemId: string, userId: string) => {
    if (!itemId || !userId) return

    setLoading(true)
    try {
      const result = await getOrCreateConversation(itemId, userId)
      if (result?.data?.id) {
        router.push(`/chat/${result.data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return { startChat, loading }
}