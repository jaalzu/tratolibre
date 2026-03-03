import { useState, useRef, useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { markMessagesAsRead } from '@/features/chat/actions'
import { fetchMessages } from '../queries'
import { useChannel } from './useChannel'
import { Message } from '@/features/chat/types'


const supabase = createClient()

export function useChat(conversationId: string, userId: string) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [isOtherOnline, setIsOtherOnline] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const readTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const queryClient = useQueryClient()

  const { sendTyping, sendNewMessage } = useChannel({
    conversationId,
    userId,
    onOnlineChange: setIsOtherOnline,
    onTyping: setIsOtherTyping,
    onNewMessage: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    }, [conversationId, queryClient]),
  })

  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 4000,
    gcTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (messages.length === 0) return
    clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(scrollTimeoutRef.current)
  }, [messages.length])

  useEffect(() => {
    if (messages.length === 0) return
    clearTimeout(readTimeoutRef.current)
    readTimeoutRef.current = setTimeout(() => {
      markMessagesAsRead(conversationId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      })
    }, 500)
    return () => clearTimeout(readTimeoutRef.current)
  }, [conversationId, messages.length, queryClient])

  const handleInputChange = useCallback((val: string) => {
    setInput(val)
    sendTyping()
  }, [sendTyping])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

 queryClient.setQueryData(['messages', conversationId], (prev: Message[] = []) => [
  ...prev,
  { id: `temp-${Date.now()}`, sender_id: userId, content, created_at: new Date().toISOString(), profiles: null }
])

    clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: userId, content })
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)

    sendNewMessage()
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    setSending(false)
  }, [input, sending, conversationId, userId, queryClient, sendNewMessage])

  return {
    messages, loading, input,
    setInput: handleInputChange,
    sending, sendMessage, bottomRef,
    isOtherOnline, isOtherTyping
  }
}