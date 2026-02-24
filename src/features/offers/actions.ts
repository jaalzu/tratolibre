'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOfferAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const Item_id = formData.get('Item_id') as string
  const amount = Number(formData.get('amount'))
  const message = formData.get('message') as string || undefined

  if (!amount || amount <= 0) return { error: 'Ingresá un monto válido' }

  // Obtener objeto
  const { data: obj } = await supabase
    .from('items')
    .select('owner_id, sale_price, title')
    .eq('id', Item_id)
    .single()

  if (!obj) return { error: 'Objeto no encontrado' }
  if (obj.owner_id === user.id) return { error: 'No podés hacerte una oferta a vos mismo' }

  // Verificar oferta previa pendiente
  const { data: existing } = await supabase
    .from('offers')
    .select('id')
    .eq('item_id', Item_id)
    .eq('buyer_id', user.id)
    .eq('status', 'pending')
    .single()

  if (existing) return { error: 'Ya tenés una oferta pendiente para este objeto' }

  const { error } = await supabase.from('offers').insert({
    Item_id,
    buyer_id: user.id,
    seller_id: obj.owner_id,
    amount,
    message,
  })

  if (error) return { error: error.message }

  revalidatePath(`/Item/${Item_id}`)
  return { success: true }
}

export async function updateOfferStatusAction(id: string, status: 'accepted' | 'rejected' | 'cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // Si se acepta, marcar objeto como vendido
  if (status === 'accepted') {
    const { data: offer } = await supabase
      .from('offers')
      .select('item_id')
      .eq('id', id)
      .single()

    if (offer) {
      await supabase
        .from('items')
        .update({ sold: true, sold_at: new Date().toISOString(), available: false })
        .eq('id', offer.item_id)

      // Rechazar otras ofertas del mismo objeto
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('Item_id', offer.item_id)
        .neq('id', id)
    }
  }

  const { error } = await supabase
    .from('offers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)

  if (error) return { error: error.message }
  revalidatePath('/offers')
  return { success: true }
}

export async function getMyOffers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { asBuyer: [], asSeller: [] }

  const { data: asBuyer } = await supabase
    .from('offers')
    .select('*, items(title, images, sale_price)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const { data: asSeller } = await supabase
    .from('offers')
    .select('*, items(title, images, sale_price), profiles!offers_buyer_id_fkey(name, avatar_url)')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return {
    asBuyer: asBuyer ?? [],
    asSeller: asSeller ?? [],
  }
}