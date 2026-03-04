import { Database } from '@/lib/supabase/database.types'

export type ReviewRow     = Database['public']['Tables']['reviews']['Row']
export type PurchaseRow   = Database['public']['Tables']['purchases']['Row']

// Review con reviewer joineado
export type ReviewWithReviewer = ReviewRow & {
  reviewer: {
    name:       string
    avatar_url: string | null
  } | null
}

// Purchase con joins de profiles e items
export type PurchaseWithRelations = PurchaseRow & {
  items: {
    title:  string
    images: string[]
  }[] | null
  buyer: {
    id:   string
    name: string
  }[] | null
  owner: {
    id:   string
    name: string
  }[] | null
}