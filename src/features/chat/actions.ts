'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── CONVERSATIONS ──────────────────────────────────────────

export async function getOrCreateConversation(itemId: string, sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }
  if (user.id === sellerId) return { error: 'No podés chatear con vos mismo' }

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('item_id', itemId)
    .eq('buyer_id', user.id)
    .single()

  if (existing) return { data: existing }

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

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      items(title, images, sale_price),
      buyer:profiles!conversations_buyer_id_fkey(name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  if (!conversations?.length) return []

  // Traer último mensaje de cada conversación
  const withLastMessage = await Promise.all(
  conversations.map(async (conv) => {
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

   const { count: unreadCount } = await supabase
  .from('messages')
  .select('*', { count: 'exact', head: true })
  .eq('conversation_id', conv.id)
  .eq('read', false)
  .neq('sender_id', user.id)

return { 
  ...conv, 
  lastMessage: lastMsg ?? null, 
  hasUnread: (unreadCount ?? 0) > 0,
  unreadCount: unreadCount ?? 0
}
  })
)

  return withLastMessage
}

// ── MESSAGES ───────────────────────────────────────────────

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

// ── OFFERS ─────────────────────────────────────────────────

export async function createOfferAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const item_id = formData.get('item_id') as string
  const amount = Number(formData.get('amount'))
  const message = formData.get('message') as string || undefined

  if (!amount || amount <= 0) return { error: 'Ingresá un monto válido' }

  const { data: obj } = await supabase
    .from('items')
    .select('owner_id, sale_price, title')
    .eq('id', item_id)
    .single()

  if (!obj) return { error: 'Objeto no encontrado' }
  if (obj.owner_id === user.id) return { error: 'No podés hacerte una oferta a vos mismo' }

  const { data: existing } = await supabase
    .from('offers')
    .select('id')
    .eq('item_id', item_id)
    .eq('buyer_id', user.id)
    .eq('status', 'pending')
    .single()

  if (existing) return { error: 'Ya tenés una oferta pendiente para este objeto' }

  const { error } = await supabase.from('offers').insert({
    item_id,
    buyer_id: user.id,
    seller_id: obj.owner_id,
    amount,
    message,
  })

  if (error) return { error: error.message }

  revalidatePath(`/item/${item_id}`)
  return { success: true }
}

export async function updateOfferStatusAction(id: string, status: 'accepted' | 'rejected' | 'cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  if (status === 'accepted') {
    const { data: offer } = await supabase
      .from('offers')
      .select('item_id')
      .eq('id', id)
      .single()

    if (offer) {
      await supabase
        .from('items')
        .update({ sold: true, sold_at: new Date().toISOString(), available: false })
        .eq('id', offer.item_id)

      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('item_id', offer.item_id)
        .neq('id', id)
    }
  }

  const { error } = await supabase
    .from('offers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)

  if (error) return { error: error.message }
  revalidatePath('/chat')
  return { success: true }
}

export async function getMyOffers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { asBuyer: [], asSeller: [] }

  const { data: asBuyer } = await supabase
    .from('offers')
    .select('*, items(title, images, sale_price)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const { data: asSeller } = await supabase
    .from('offers')
    .select('*, items(title, images, sale_price), profiles!offers_buyer_id_fkey(name, avatar_url)')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return { asBuyer: asBuyer ?? [], asSeller: asSeller ?? [] }
}


export async function getUnreadCount(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('read', false)
    .neq('sender_id', userId)

  return count ?? 0
}