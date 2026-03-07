import { useState, useRef, useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { markMessagesAsRead, sendMessageAction } from '@/features/chat/actions/messages'
import { fetchMessages } from '../queries'
import { useChannel } from './useChannel'
import { Message } from '@/features/chat/types'

export function useChat(conversationId: string, userId: string) {
  const [input,         setInput]         = useState('')
  const [sending,       setSending]       = useState(false)
  const [sendError,     setSendError]     = useState<string | null>(null)
  const [isOtherOnline, setIsOtherOnline] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const bottomRef        = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const readTimeoutRef   = useRef<NodeJS.Timeout | undefined>(undefined)
  const queryClient      = useQueryClient()

  const scrollToBottom = useCallback(() => {
    clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

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
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
  })

  // Scroll al último mensaje
  useEffect(() => {
    if (messages.length === 0) return
    scrollToBottom()
    return () => clearTimeout(scrollTimeoutRef.current)
  }, [messages.length, scrollToBottom])

  // Marcar como leídos
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
    setSendError(null)
    const content = input.trim()
    setInput('')

    // Optimistic update
    queryClient.setQueryData(['messages', conversationId], (prev: Message[] = []) => [
      ...prev,
      { id: `temp-${Date.now()}`, sender_id: userId, content, created_at: new Date().toISOString(), profiles: null }
    ])
    scrollToBottom()

    const result = await sendMessageAction(conversationId, content)

    if (result?.error) {
      setSendError(result.error)
      // Revertir optimistic update
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    } else {
      sendNewMessage()
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    setSending(false)
  }, [input, sending, conversationId, userId, queryClient, sendNewMessage, scrollToBottom])

  return {
    messages, loading, input,
    setInput: handleInputChange,
    sending, sendMessage, bottomRef,
    isOtherOnline, isOtherTyping, sendError,
  }
}