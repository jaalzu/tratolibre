'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { markMessagesAsRead } from '@/features/chat/actions'

export function useChat(conversationId: string, userId: string, type?: string) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Pre-llenar input según tipo
  useEffect(() => {
    if (type === 'offer') setInput('Hola, te quiero hacer una oferta por ')
    if (type === 'buy') setInput('Hola, estoy interesado en comprar ')
  }, [type])

  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      return data ?? []
    },
    refetchInterval: 3000,
  })

  // Scroll cuando llegan mensajes nuevos
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [messages.length])

  // Marcar como leídos al entrar
 useEffect(() => {
  // Optimistic — quitar badge inmediatamente
  queryClient.setQueryData(['conversations'], (prev: any[]) =>
    (prev ?? []).map(c => c.id === conversationId ? { ...c, hasUnread: false } : c)
  )
  // Luego confirmar en el server
  markMessagesAsRead(conversationId)
}, [conversationId])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

    const supabase = createClient()

    // Optimistic update
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

    // Refetch para reemplazar el optimista con el real
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })

    setSending(false)
  }

  return { messages, loading, input, setInput, sending, sendMessage, bottomRef }
}