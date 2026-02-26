'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useChat(conversationId: string, userId: string, type?: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior }), 100)
  }

const loadMessages = async (initial = false) => {
  const { data } = await supabase
    .from('messages')
    .select('*, profiles(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  const newMessages = data ?? []
  
  setMessages(prev => {
    const hadNewMessage = newMessages.length > prev.length
    if (hadNewMessage || initial) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: initial ? 'auto' : 'smooth' }), 100)
    }
    return newMessages
  })
  
  setLoading(false)
}

useEffect(() => {
  loadMessages(true)
  const interval = setInterval(() => loadMessages(), 3000)
  return () => clearInterval(interval)
}, [conversationId])

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

    // Mensaje optimista
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [...prev, {
      id: tempId,
      sender_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: null,
    }])
    scrollToBottom()

    const supabase = createClient()
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
    })

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    setSending(false)
  }

  return {
    messages,
    loading,
    input,
    setInput,
    sending,
    sendMessage,
    bottomRef,
  }
}