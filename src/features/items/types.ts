export interface Item {
  id: string
  owner_id: string
  title: string
  description: string
  category: string
  condition: 'new' | 'like_new' | 'good' | 'fair'
  sale_price: number
  province: string
  city?: string
  location?: string
  type: 'sale' | 'exchange' | 'both'
  images: string[]
  available: boolean
  sold: boolean
  views_count: number
  created_at: string
  updated_at: string
  sold_at?: string
  profiles?: {
    id: string
    name: string
    avatar_url: string
    rating: number
    reviews_count: number
  }
}