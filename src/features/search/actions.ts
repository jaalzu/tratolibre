'use server'

import { createClient } from '@/lib/supabase/server'

export type SearchParams = {
  keywords?:  string
  category?:  string
  province?:  string
  date?:      'today' | 'week' | 'month'
  min_price?: number
  max_price?: number
  condition?: string
  order_by?:  'closest' | 'most_relevance' | 'price_asc' | 'price_desc'
}

function getDateFilter(date?: string): string | null {
  if (!date) return null
  const now = new Date()
  if (date === 'today') {
    now.setHours(0, 0, 0, 0)
    return now.toISOString()
  }
  if (date === 'week') {
    now.setDate(now.getDate() - 7)
    return now.toISOString()
  }
  if (date === 'month') {
    now.setDate(now.getDate() - 30)
    return now.toISOString()
  }
  return null
}

export async function searchItems(params: SearchParams) {
  const supabase = await createClient()

  let q = supabase
    .from('items')
    .select('*, profiles(name, avatar_url, rating)')
    .eq('available', true)
    .eq('sold', false)

  if (params.keywords) q = q.ilike('title', `%${params.keywords}%`)
  if (params.category)  q = q.eq('category', params.category)
  if (params.province)  q = q.eq('province', params.province)
  if (params.condition) q = q.eq('condition', params.condition)
  if (params.min_price) q = q.gte('sale_price', params.min_price)
  if (params.max_price) q = q.lte('sale_price', params.max_price)

  const dateFrom = getDateFilter(params.date)
  if (dateFrom) q = q.gte('created_at', dateFrom)

  // Ordenar
  switch (params.order_by) {
    case 'price_asc':
      q = q.order('sale_price', { ascending: true })
      break
    case 'price_desc':
      q = q.order('sale_price', { ascending: false })
      break
    default:
      // closest y most_relevance → más reciente por ahora
      q = q.order('created_at', { ascending: false })
  }

  const { data } = await q
  return data ?? []
}