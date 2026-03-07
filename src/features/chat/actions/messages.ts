'use server'

import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { checkRateLimit } from '@/lib/rateLimit'
import { revalidatePath } from 'next/cache'

const MAX_LENGTH = 1000

export async function markMessagesAsRead(conversationId: string) {
  const { supabase, user } = await getAuthUser()
  if (!user) return

  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .eq('read', false)

  revalidatePath('/chat', 'layout')
}

export async function sendMessageAction(conversationId: string, content: string) {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: 'No autorizado' }

  const trimmed = content.trim()
  if (!trimmed)                    return { error: 'El mensaje no puede estar vacío' }
  if (trimmed.length > MAX_LENGTH) return { error: `Máximo ${MAX_LENGTH} caracteres` }

  // Rate limit: máx 30 mensajes por minuto
  const allowed = await checkRateLimit(supabase, user.id, 'send_message', 30, 1)
  if (!allowed) return { error: 'Estás enviando mensajes muy rápido, esperá un momento' }

  // Verificar que el usuario pertenece a la conversación
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single()

  if (!conversation) return { error: 'Conversación no encontrada' }

  const { error: msgError } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content: trimmed })

  if (msgError) return { error: msgError.message }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return { success: true }
}