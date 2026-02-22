'use server'

import { createClient } from '@/lib/supabase/server'
import { ReservationSchema } from './schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createReservationAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const raw = {
    object_id: formData.get('object_id'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    message: formData.get('message') || undefined,
  }

  const parsed = ReservationSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  // Obtener objeto
  const { data: obj } = await supabase
    .from('objects')
    .select('*')
    .eq('id', parsed.data.object_id)
    .single()

  if (!obj) return { error: 'Objeto no encontrado' }
  if (obj.owner_id === user.id) return { error: 'No podés reservar tu propio objeto' }

  // Calcular precio
  const days = Math.ceil(
    (new Date(parsed.data.end_date).getTime() - new Date(parsed.data.start_date).getTime()) / 86400000
  )
  const total_price = obj.price_per_day * days

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      object_id: parsed.data.object_id,
      renter_id: user.id,
      owner_id: obj.owner_id,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      total_price,
      deposit_amount: obj.deposit || 0,
      message: parsed.data.message,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/reservations')
  redirect('/dashboard/reservations')
}

export async function updateReservationStatusAction(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .or(`owner_id.eq.${user.id},renter_id.eq.${user.id}`)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/reservations')
}

export async function getMyReservations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { asRenter: [], asOwner: [] }

  const { data: asRenter } = await supabase
    .from('reservations')
    .select('*, objects(title, images, price_per_day), profiles!reservations_owner_id_fkey(name, avatar_url)')
    .eq('renter_id', user.id)
    .order('created_at', { ascending: false })

  const { data: asOwner } = await supabase
    .from('reservations')
    .select('*, objects(title, images, price_per_day), profiles!reservations_renter_id_fkey(name, avatar_url)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return {
    asRenter: asRenter ?? [],
    asOwner: asOwner ?? [],
  }
}