'use server'

import { createClient } from '@/lib/supabase/server'
import { ObjectSchema } from './schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createObjectAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    sale_price: formData.get('sale_price'),
    location: formData.get('location'),
    city: formData.get('city'),
    condition: formData.get('condition'),
    rules: formData.get('rules') || undefined,
    images: formData.getAll('images') as string[],
  }

  const parsed = ObjectSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { data: object, error } = await supabase
    .from('objects')
    .insert({ ...parsed.data, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/explore')
  redirect(`/object/${object.id}`)
}

export async function updateObjectAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const id = formData.get('id') as string

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    sale_price: formData.get('sale_price'),
    location: formData.get('location'),
    city: formData.get('city'),
    condition: formData.get('condition'),
    rules: formData.get('rules') || undefined,
    images: formData.getAll('images') as string[],
  }

  const parsed = ObjectSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { error } = await supabase
    .from('objects')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/object/${id}`)
  redirect(`/object/${id}`)
}

export async function deleteObjectAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('objects')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/objects')
  redirect('/dashboard/objects')
}

export async function getObjectById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('objects')
    .select('*, profiles(id, name, avatar_url, rating, reviews_count)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getObjects(params: {
  query?: string
  category?: string
  city?: string
} = {}) {
  const supabase = await createClient()

  let q = supabase
    .from('objects')
    .select('*, profiles(name, avatar_url, rating)')
    .eq('available', true)
    .eq('sold', false)
    .order('created_at', { ascending: false })

  if (params.query) {
    q = q.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
  }
  if (params.category) q = q.eq('category', params.category)
  if (params.city) q = q.ilike('city', `%${params.city}%`)

  const { data } = await q
  return data ?? []
}

export async function toggleFavoriteAction(objectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('object_id', objectId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, object_id: objectId })
    return { favorited: true }
  }
}