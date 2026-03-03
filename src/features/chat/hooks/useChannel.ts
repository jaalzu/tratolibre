import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient()

interface UseChannelOptions {
  conversationId: string
  userId: string
  onTyping: (isTyping: boolean) => void
  onNewMessage: () => void
  onOnlineChange: (isOnline: boolean) => void
}

export function useChannel({ conversationId, userId, onTyping, onNewMessage, onOnlineChange }: UseChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const channel = supabase.channel(`presence:${conversationId}`, {
      config: { presence: { key: userId } }
    })

    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const others = Object.keys(channel.presenceState()).filter(k => k !== userId)
        onOnlineChange(others.length > 0)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key !== userId) onOnlineChange(true)
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== userId) onOnlineChange(false)
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId) {
          onTyping(true)
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000)
        }
      })
      .on('broadcast', { event: 'new_message' }, () => {
        onNewMessage()
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && channelRef.current) {
          await channel.track({ userId, online: true })
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Canal desconectado:', status)
        }
      })

    return () => {
      clearTimeout(typingTimeoutRef.current)
      channelRef.current = null
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, onTyping, onNewMessage, onOnlineChange])

  const sendTyping = () => {
    channelRef.current?.send({
      type: 'broadcast', event: 'typing', payload: { userId },
    })
  }

  const sendNewMessage = () => {
    channelRef.current?.send({
      type: 'broadcast', event: 'new_message', payload: {},
    })
  }

  return { sendTyping, sendNewMessage }
}