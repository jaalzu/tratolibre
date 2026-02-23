'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Box, Flex, Text, Input, Circle, Spinner, Stack } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'

export default function ChatWindow({
  conversationId,
  userId,
  type,
}: {
  conversationId: string
  userId: string
  type?: string
}) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior }), 100)
  }

  // Pre-llenar input según tipo (Interés de compra)
  useEffect(() => {
    if (type === 'offer') setInput('Hola, te quiero hacer una oferta por ')
    if (type === 'buy') setInput('Hola, estoy interesado en comprar ')
  }, [type])

  async function loadMessages() {
    const supabase = createClient()
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    setMessages(data ?? [])
    setLoading(false)
    scrollToBottom('auto')
  }

  useEffect(() => {
    loadMessages()
  }, [conversationId])

  async function handleSend() {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

    const tempMsg = {
      id: Date.now(),
      sender_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: null,
    }
    
    setMessages(prev => [...prev, tempMsg])
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

  if (loading) {
    return (
      <Flex p="8" justify="center" align="center" direction="column" gap="2">
        <Spinner color="brand.default" size="sm" />
        <Text fontSize="xs" color="neutral.400">Cargando mensajes...</Text>
      </Flex>
    )
  }

  return (
    <Flex 
      direction="column" 
      h="full" 
      border="1px solid" 
      borderColor="neutral.100" 
      borderRadius="xl" 
      overflow="hidden"
      bg="white"
    >
      {/* Área de Mensajes */}
      <Box flex="1" overflowY="auto" p="4">
        {messages.length === 0 ? (
          <Text textAlign="center" color="neutral.400" fontSize="sm" mt="8">
            No hay mensajes aún. ¡Empezá la conversación!
          </Text>
        ) : (
          <Stack gap="3">
            {messages.map((msg: any) => {
              const isMine = msg.sender_id === userId
              return (
                <Flex 
                  key={msg.id} 
                  gap="2" 
                  flexDirection={isMine ? 'row-reverse' : 'row'}
                  alignItems="flex-end"
                >
                  <Circle 
                    size="7" 
                    bg={isMine ? "brand.default" : "neutral.100"} 
                    color={isMine ? "white" : "neutral.700"} 
                    fontSize="xs" 
                    fontWeight="bold"
                    flexShrink="0"
                  >
                    {msg.profiles?.name?.[0]?.toUpperCase() ?? '?'}
                  </Circle>
                  
                  <Box 
                    maxW="75%" 
                    px="3" 
                    py="2" 
                    borderRadius="2xl" 
                    fontSize="sm"
                    bg={isMine ? "brand.default" : "neutral.100"}
                    color={isMine ? "white" : "neutral.900"}
                    borderBottomRightRadius={isMine ? "xs" : "2xl"}
                    borderBottomLeftRadius={isMine ? "2xl" : "xs"}
                  >
                    {msg.content}
                  </Box>
                </Flex>
              )
            })}
            <div ref={bottomRef} />
          </Stack>
        )}
      </Box>

      {/* Input de Envío */}
      <Flex p="3" gap="2" borderTop="1px solid" borderColor="neutral.100" bg="neutral.50">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribí un mensaje..."
          bg="white"
          fontSize="sm"
          borderColor="neutral.200"
          borderRadius="xl"
          _focus={{ 
            borderColor: "brand.default", 
            boxShadow: "focus" 
          }}
        />
        <Button 
          onClick={handleSend} 
          disabled={sending || !input.trim()}
          size="md"
          px="6"
        >
          {sending ? <Spinner size="xs" /> : "Enviar"}
        </Button>
      </Flex>
    </Flex>
  )
}