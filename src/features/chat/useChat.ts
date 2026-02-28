import { useEffect, useState, useRef, useCallback } from 'react'
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
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const channelRef = useRef<any>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (type === 'offer') setInput('Hola, te quiero hacer una oferta por ')
    if (type === 'buy') setInput('Hola, estoy interesado en comprar ')
  }, [type])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`presence:${conversationId}`, {
      config: { presence: { key: userId } }
    })

    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const others = Object.keys(channel.presenceState()).filter(k => k !== userId)
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
      .on('broadcast', { event: 'new_message' }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await channel.track({ userId, online: true })
      })

    return () => {
      clearTimeout(typingTimeoutRef.current)
      channelRef.current = null
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, queryClient])

  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  })

  useEffect(() => {
    if (messages.length > 0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [messages.length])

  useEffect(() => {
    markMessagesAsRead(conversationId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    })
  }, [conversationId, messages.length])

  const handleInputChange = useCallback((val: string) => {
    setInput(val)
    channelRef.current?.send({
      type: 'broadcast', event: 'typing', payload: { userId },
    })
  }, [userId])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    const supabase = createClient()

    queryClient.setQueryData(['messages', conversationId], (prev: any[] = []) => [
      ...prev,
      { id: `temp-${Date.now()}`, sender_id: userId, content, created_at: new Date().toISOString(), profiles: null }
    ])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

    await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: userId, content })
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)

    channelRef.current?.send({
      type: 'broadcast', event: 'new_message', payload: {}
    })

    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    setSending(false)
  }, [input, sending, conversationId, userId, queryClient])

  return {
    messages, loading, input,
    setInput: handleInputChange,
    sending, sendMessage, bottomRef,
    isOtherOnline, isOtherTyping
  }
}