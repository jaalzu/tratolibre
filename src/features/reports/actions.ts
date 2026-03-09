// features/reports/actions.ts
'use server'

import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { ReportSchema } from './schemas'
import { checkRateLimit } from '@/lib/rateLimit'

export async function createReportAction(input: unknown) {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: 'Tenés que iniciar sesión para reportar' }

  // Rate limit: máx 10 reportes por hora
  const allowed = await checkRateLimit(supabase, user.id, 'create_report', 10, 60)
  if (!allowed) return { error: 'Demasiados reportes. Esperá un momento.' }

  const parsed = ReportSchema.safeParse(input)
  if (!parsed.success) return { error: 'Datos inválidos' }

  const { type, target_id, reason, description } = parsed.data

  // No podés reportarte a vos mismo
  if (type === 'user' && target_id === user.id) {
    return { error: 'No podés reportarte a vos mismo' }
  }

  // Verificar que no exista un reporte previo del mismo usuario al mismo target
  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', user.id)
    .eq('target_id', target_id)
    .eq('status', 'pending')
    .single()

  if (existing) return { error: 'Ya reportaste este contenido. Estamos revisándolo.' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    type,
    target_id,
    reason,
    description,
  })

  if (error) return { error: error.message }

  return { success: true }
}