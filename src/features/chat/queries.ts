import { createClient } from '@/lib/supabase/client'

export async function fetchMessages(conversationId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('messages')
    .select('*, profiles(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function fetchDealStatus(dealId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('deals')
    .select('status')
    .eq('id', dealId)
    .single()
  return data?.status ?? null
}