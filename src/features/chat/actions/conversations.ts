'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export async function getOrCreateConversation(itemId: string, sellerId: string) {
  const { supabase, user } = await getAuthUser()
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
  const { supabase, user } = await getAuthUser()
  if (!user) return []

  const { data: conversations } = await supabase
    .from('conversation_summaries')
    .select('*')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  if (!conversations?.length) return []

  const { data: unreadData } = await supabase
    .from('messages')
    .select('conversation_id')
    .eq('read', false)
    .neq('sender_id', user.id)
    .in('conversation_id', conversations.map(c => c.id))

  const unreadMap = (unreadData ?? []).reduce((acc: Record<string, number>, msg: any) => {
    acc[msg.conversation_id] = (acc[msg.conversation_id] ?? 0) + 1
    return acc
  }, {})

  return conversations.map((conv) => ({
    ...conv,
    lastMessage: conv.last_message_content ? {
      content: conv.last_message_content,
      created_at: conv.last_message_at,
    } : null,
    hasUnread: (unreadMap[conv.id] ?? 0) > 0,
    unreadCount: unreadMap[conv.id] ?? 0,
  }))
}

export async function deleteConversationAction(conversationId: string) {
  const { supabase, user } = await getAuthUser()
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
  const { supabase, user } = await getAuthUser()
  if (!user) return 0

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)
    .neq('sender_id', user.id)

  return count ?? 0
}

export async function getConversationsByItem(itemId: string) {
  const { supabase, user } = await getAuthUser()
  if (!user) return []

  const { data } = await supabase
    .from('conversations')
    .select('id, buyer_id, buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url)')
    .eq('item_id', itemId)
    .eq('seller_id', user.id)

  return data ?? []
}