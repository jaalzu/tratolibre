import { Database } from '@/lib/supabase/database.types'

export type Item = Database['public']['Tables']['items']['Row']
export type ItemInsert = Database['public']['Tables']['items']['Insert']
export type ItemUpdate = Database['public']['Tables']['items']['Update']
export type ItemSummary = Pick<Item, 'id' | 'title' | 'images' | 'sale_price' | 'sold' | 'available' | 'created_at' | 'city'>

export interface ItemWithProfile extends Item {
  profiles: {
    id: string
    name: string
    avatar_url: string
    rating: number
    reviews_count: number
  } | null
}