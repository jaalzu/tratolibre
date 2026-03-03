'use server'

import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getMyProfile() {
  const { supabase, user } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: items } = await supabase
    .from('items')
    .select('id, title, images, sale_price, sold, available, created_at, city')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const { count: salesCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .eq('sold', true)

  return { profile, items: items ?? [], salesCount: salesCount ?? 0 }
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const { data: items } = await supabase
    .from('items')
    .select('id, title, images, sale_price, sold, available, created_at, city')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)')
    .eq('reviewed_id', userId)
    .order('created_at', { ascending: false })

  const { count: salesCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)
    .eq('sold', true)

  return { profile, items: items ?? [], reviews: reviews ?? [], salesCount: salesCount ?? 0 }
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await getAuthUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const location = formData.get('location') as string

  const { error } = await supabase
    .from('profiles')
    .update({ name, location, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  redirect('/profile')
}