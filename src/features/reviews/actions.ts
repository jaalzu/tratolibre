'use server'

import { createClient } from '@/lib/supabase/server'

export async function getReviewsByProfile(profileId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_reviewer_id_fkey(name, avatar_url)')
    .eq('reviewed_id', profileId)
    .order('created_at', { ascending: false })
  return data ?? []
}