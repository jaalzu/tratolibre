'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChatWindow({ reservationId, userId }: { reservationId: string, userId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(name, avatar_url)')
      .eq('reservation_id', reservationId)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    loadMessages()
  }, [reservationId])

  async function handleSend() {
    if (!input.trim() || sending) return
    setSending(true)

    const content = input.trim()
    setInput('')

    // Agregar mensaje localmente de inmediato
    const tempMsg = {
      id: Date.now(),
      sender_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: null,
    }
    setMessages(prev => [...prev, tempMsg])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

    // Insertar en DB
    await supabase.from('messages').insert({
      reservation_id: reservationId,
      sender_id: userId,
      content,
    })

    setSending(false)
  }

  if (loading) return <div className="text-sm text-gray-400 p-4">Cargando mensajes...</div>

  return (
    <div className="flex flex-col h-[500px] border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            No hay mensajes aún. ¡Empezá la conversación!
          </p>
        )}
        {messages.map((msg: any) => (
          <div key={msg.id}
            className={`flex gap-2 ${msg.sender_id === userId ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
              {msg.profiles?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
              msg.sender_id === userId
                ? 'bg-green-500 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribí un mensaje..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={handleSend} disabled={sending}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Enviar
        </button>
      </div>
    </div>
  )
}