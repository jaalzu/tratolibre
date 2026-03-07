import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Verifica y registra un intento de acción.
 * Retorna false si se superó el límite.
 *
 * @param supabase  - cliente de Supabase ya autenticado
 * @param userId    - id del usuario
 * @param action    - nombre de la acción (ej: 'update_profile', 'create_item')
 * @param max       - máximo de intentos permitidos en la ventana
 * @param windowMin - ventana de tiempo en minutos
 */
export async function checkRateLimit(
  supabase:  SupabaseClient,
  userId:    string,
  action:    string,
  max:       number,
  windowMin: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowMin * 60 * 1000).toISOString()

  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
    .gte('created_at', since)

  if ((count ?? 0) >= max) return false

  await supabase.from('rate_limits').insert({ user_id: userId, action })

  return true
}