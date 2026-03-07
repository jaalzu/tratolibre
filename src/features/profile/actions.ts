'use server'

import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EditProfileSchema } from '@/features/profile/schemas'
import { checkRateLimit } from '@/lib/rateLimit'

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

  // Rate limit: máx 5 updates cada 10 minutos
  const allowed = await checkRateLimit(supabase, user.id, 'update_profile', 5, 10)
  if (!allowed) return { error: 'Demasiados intentos, esperá unos minutos' }

  const name     = formData.get('name')     as string
  const location = formData.get('location') as string
  const province = formData.get('province') as string
  const avatar   = formData.get('avatar')   as File | null

  const parsed = EditProfileSchema.safeParse({ name, location, province })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { name: safeName, location: safeLocation, province: safeProvince } = parsed.data

  let avatarUrl: string | undefined

  if (avatar && avatar.size > 0) {
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png':  'png',
      'image/webp': 'webp',
    }
    const ext = extMap[avatar.type]
    if (!ext) return { error: 'Tipo de imagen no permitido' }

    const filename = `${user.id}/avatar.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('profile-avatars')
      .upload(filename, avatar, { contentType: avatar.type, upsert: true })

    if (uploadError) return { error: uploadError.message }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-avatars')
      .getPublicUrl(data.path)

    avatarUrl = publicUrl
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      name:     safeName,
      location: safeLocation,
      province: safeProvince,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
}


export async function getUserProvince(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('province')
    .eq('id', userId)
    .single()
  return data?.province ?? null
}