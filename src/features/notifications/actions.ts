'use server'

import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type NotificationType = 'sale_completed' | 'purchase_completed' | 'review_received'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

/** Insertar notificación (uso interno desde otras actions) */
export async function createNotification({
  supabase,
  userId,
  type,
  data,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  type: NotificationType
  data: Record<string, unknown>
}) {
  const { error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, type, data })

  if (error) console.error('[createNotification]', error.message)
}

/** Obtener notificaciones del usuario autenticado */
export async function getMyNotifications() {
  const { supabase, user } = await getAuthUser()
  if (!user) return []

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (data ?? []) as Notification[]
}

/** Count de no leídas */
export async function getUnreadCount(): Promise<number> {
  const { supabase, user } = await getAuthUser()
  if (!user) return 0

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)

  return count ?? 0
}

/** Marcar una notificación como leída */
export async function markNotificationRead(id: string) {
  const { supabase, user } = await getAuthUser()
  if (!user) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id)

}

/** Marcar todas como leídas */
export async function markAllNotificationsRead() {
  const { supabase, user } = await getAuthUser()
  if (!user) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

}