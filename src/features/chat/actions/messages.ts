'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMessages(conversationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('messages')
    .select('*, profiles(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function markMessagesAsRead(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', user.id)
    .gte('created_at', oneMinuteAgo)

  if (count && count >= 20) return { error: 'Demasiados mensajes. Esperá un momento.' }

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  })

  if (error) return { error: error.message }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  revalidatePath('/chat')
  return { success: true }
}