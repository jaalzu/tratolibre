'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState } from 'react'

export function useChat(reservationId: string, userId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(name, avatar_url)')
        .eq('reservation_id', reservationId)
        .order('created_at', { ascending: true })
      setMessages(data ?? [])
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }

    loadMessages()

    const channel = supabase
      .channel(`chat:${reservationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `reservation_id=eq.${reservationId}`,
      }, async (payload) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', payload.new.sender_id)
          .single()
        setMessages(prev => [...prev, { ...payload.new, profiles: profile }])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [reservationId])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return
    const supabase = createClient()
    await supabase.from('messages').insert({
      reservation_id: reservationId,
      sender_id: userId,
      content: content.trim(),
    })
  }

  return { messages, loading, sendMessage, bottomRef }
}