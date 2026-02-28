'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
        unreadCount: unreadCount ?? 0,
      }
    })
  )

  return withLastMessage
}

export async function deleteConversationAction(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

  if (error) return { error: error.message }
  revalidatePath('/chat', 'layout')
  return { success: true }
}

export async function getTotalUnreadCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)
    .neq('sender_id', user.id)

  return count ?? 0
}