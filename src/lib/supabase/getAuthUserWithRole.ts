// lib/supabase/getAuthUserWithRole.ts
import { cache } from 'react'
import { getAuthUser } from './getAuthUser'

export const getAuthUserWithRole = cache(async () => {
  const { supabase, user } = await getAuthUser()
  if (!user) return { supabase, user: null, role: null }

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { supabase, user, role: data?.role ?? 'user' }
})