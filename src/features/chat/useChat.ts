import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { markMessagesAsRead } from '@/features/chat/actions'
import { fetchMessages } from './queries'

export function useChat(conversationId: string, userId: string, type?: string) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [isOtherOnline, setIsOtherOnline] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (type === 'offer') setInput('Hola, te quiero hacer una oferta por ')
    if (type === 'buy') setInput('Hola, estoy interesado en comprar ')
  }, [type])

  // Presence — online + typing
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase.channel(`presence:${conversationId}`, {
      config: { presence: { key: userId } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const others = Object.keys(state).filter(k => k !== userId)
        setIsOtherOnline(others.length > 0)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key !== userId) setIsOtherOnline(true)
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== userId) setIsOtherOnline(false)
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId) {
          setIsOtherTyping(true)
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2000)
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ userId, online: true })
        }
      })

    return () => {
      clearTimeout(typingTimeoutRef.current)
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId])

  // Emitir typing cuando el usuario escribe
  const handleInputChange = (val: string) => {
    setInput(val)

    const supabase = createClient()
    const channel = supabase.channel(`presence:${conversationId}`)
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId },
    })
  }

  const { data: messages = [], isLoading: loading } = useQuery({
  queryKey: ['messages', conversationId],
  queryFn: () => fetchMessages(conversationId),
  refetchInterval: 3000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
})

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [messages.length])

  useEffect(() => {
    markMessagesAsRead(conversationId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    })
  }, [conversationId])

  const sendMessage = async () => {
  if (!input.trim() || sending) return
  setSending(true)
  const content = input.trim()
  setInput('')

  const supabase = createClient()

  queryClient.setQueryData(['messages', conversationId], (prev: any[]) => [
    ...(prev ?? []),
    {
      id: `temp-${Date.now()}`,
      sender_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: null,
    }
  ])

  setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

  await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: userId,
    content,
  })

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
  queryClient.invalidateQueries({ queryKey: ['conversations'] })

  setSending(false)
}

  return { 
    messages, loading, input, 
    setInput: handleInputChange,
    sending, sendMessage, bottomRef,
    isOtherOnline, isOtherTyping
  }
}