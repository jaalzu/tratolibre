'use server'

import { createClient } from '@/lib/supabase/server'
import { ItemSchema } from './schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createItemAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .gte('created_at', oneHourAgo)

  if (count && count >= 8) {
    return { error: 'Alcanzaste el límite de 8 publicaciones por hora. Intentá más tarde.' }
  }

  const raw = {
    title:       formData.get('title'),
    description: formData.get('description'),
    category:    formData.get('category'),
    condition:   formData.get('condition'),
    sale_price:  formData.get('sale_price'),
    province:    formData.get('province'),
    city:        formData.get('city') || undefined,
    location:    formData.get('location') || undefined,
    type:        formData.get('type'),
    images:      formData.getAll('images') as string[],
  }

  const parsed = ItemSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { data: item, error } = await supabase
    .from('items')
    .insert({ ...parsed.data, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/explore')
  redirect(`/item/${item.id}`)
}

export async function updateItemAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const id = formData.get('id') as string

  const raw = {
    title:       formData.get('title'),
    description: formData.get('description'),
    category:    formData.get('category'),
    condition:   formData.get('condition'),
    sale_price:  formData.get('sale_price'),
    province:    formData.get('province'),
    city:        formData.get('city') || undefined,
    location:    formData.get('location') || undefined,
    type:        formData.get('type'),
    images:      formData.getAll('images') as string[],
  }

  const parsed = ItemSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { error } = await supabase
    .from('items')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/item/${id}`)
  redirect(`/item/${id}`)
}

export async function deleteItemAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/items')
  redirect('/items')
}

export async function getItemById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('items')
    .select('*, profiles(id, name, avatar_url, rating, reviews_count)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getItems(params: {
  query?:    string
  category?: string
  city?:     string
  province?: string
  type?:     string
} = {}) {
  const supabase = await createClient()

  let q = supabase
    .from('items')
    .select('*, profiles(name, avatar_url, rating)')
    .eq('available', true)
    .eq('sold', false)
    .order('created_at', { ascending: false })

  if (params.query)    q = q.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
  if (params.category) q = q.eq('category', params.category)
  if (params.city)     q = q.ilike('city', `%${params.city}%`)
  if (params.province) q = q.eq('province', params.province)
  if (params.type)     q = q.eq('type', params.type)

  const { data } = await q
  return data ?? []
}

export async function getItemsByCategory(category: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('items')
    .select('*, profiles(name, avatar_url, rating, reviews_count)')
    .eq('category', category)
    .eq('available', true)
    .eq('sold', false)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function toggleFavoriteAction(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, item_id: itemId })
    return { favorited: true }
  }
}