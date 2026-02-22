'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const ReviewSchema = z.object({
  reservation_id: z.string().uuid(),
  reviewed_id: z.string().uuid(),
  object_id: z.string().uuid().optional(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  role: z.enum(['owner_to_renter', 'renter_to_owner']),
})

export async function createReviewAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const raw = {
    reservation_id: formData.get('reservation_id'),
    reviewed_id: formData.get('reviewed_id'),
    object_id: formData.get('object_id') || undefined,
    rating: formData.get('rating'),
    comment: formData.get('comment') || undefined,
    role: formData.get('role'),
  }

  const parsed = ReviewSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  // Verificar que la reserva esté completada
  const { data: res } = await supabase
    .from('reservations')
    .select('status, renter_id, owner_id')
    .eq('id', parsed.data.reservation_id)
    .single()

  if (res?.status !== 'completed') return { error: 'Solo podés dejar review en reservas completadas' }

  // Verificar que no haya dejado review antes
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('reservation_id', parsed.data.reservation_id)
    .eq('reviewer_id', user.id)
    .single()

  if (existing) return { error: 'Ya dejaste una review para esta reserva' }

  const { error } = await supabase.from('reviews').insert({
    ...parsed.data,
    reviewer_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/reservations')
  return { success: true }
}

export async function getReviewsByProfile(profileId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_reviewer_id_fkey(name, avatar_url)')
    .eq('reviewed_id', profileId)
    .order('created_at', { ascending: false })

  return data ?? []
}