'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrCreateConversation(itemId: string, sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }
  if (user.id === sellerId) return { error: 'No podés chatear con vos mismo' }

  // Buscar conversación existente
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('item_id', itemId)
    .eq('buyer_id', user.id)
    .single()

  if (existing) return { data: existing }

  // Crear nueva
  const { data, error } = await supabase
    .from('conversations')
    .insert({ item_id: itemId, buyer_id: user.id, seller_id: sellerId })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getMyConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

 const { data } = await supabase
  .from('conversations')
  .select(`
    *,
    item:items(title, images, sale_price),
    buyer:profiles!conversations_buyer_id_fkey(name, avatar_url),
    seller:profiles!conversations_seller_id_fkey(name, avatar_url)
  `)
  .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
  .order('updated_at', { ascending: false })

  return data ?? []
}

export async function sendMessageAction(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  })

  if (error) return { error: error.message }

  // Actualizar updated_at de la conversación
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  revalidatePath('/messages')
  return { success: true }
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('messages')
    .select('*, profiles(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return data ?? []
}