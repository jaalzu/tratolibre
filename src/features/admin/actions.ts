// features/admin/actions.ts
'use server'

import { getAuthUserWithRole } from '@/lib/supabase/getAuthUserWithRole'
import { redirect } from 'next/navigation'

async function getAdminClient() {
  const { supabase, role } = await getAuthUserWithRole()
  if (role !== 'admin') redirect('/')
  return supabase
}

export async function getAdminMetrics() {
  const supabase = await getAdminClient()

  const [
    { count: totalUsers },
    { count: newUsers },
    { count: totalItems },
    { count: newItems },
    { count: pendingReports },
    { count: totalConversations },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('items').select('*', { count: 'exact', head: true })
      .eq('available', true).eq('sold', false),
    supabase.from('items').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('reports').select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalUsers:        totalUsers ?? 0,
    newUsers:          newUsers ?? 0,
    totalItems:        totalItems ?? 0,
    newItems:          newItems ?? 0,
    pendingReports:    pendingReports ?? 0,
    totalConversations: totalConversations ?? 0,
  }
}


export async function getAdminReports(type?: string, status?: string) {
  const supabase = await getAdminClient()

  let query = supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reports_reporter_id_fkey(id, name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (type && type !== 'all') query = query.eq('type', type)
  if (status && status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) return []
  return data
}

export async function dismissReportAction(reportId: string) {
  const supabase = await getAdminClient()
  const { user } = await getAuthUserWithRole()

  const { error } = await supabase
    .from('reports')
    .update({
      status: 'dismissed',
      resolved_by: user!.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteReportedItemAction(reportId: string, itemId: string) {
  const supabase = await getAdminClient()
  const { user } = await getAuthUserWithRole()

  // Traer imágenes del item para limpiar storage
  const { data: item } = await supabase
    .from('items')
    .select('images')
    .eq('id', itemId)
    .single()

  // Eliminar imágenes del storage
  if (item?.images?.length) {
    const paths = item.images.map((url: string) => url.split('/item-images/')[1])
    await supabase.storage.from('item-images').remove(paths)
  }

  // Eliminar item (cascadea favoritos y conversaciones por FK)
  const { error } = await supabase.from('items').delete().eq('id', itemId)
  if (error) return { error: error.message }

  // Marcar reporte como resuelto
  await supabase
    .from('reports')
    .update({
      status: 'reviewed',
      resolved_by: user!.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  return { success: true }
}