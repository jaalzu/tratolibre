import { Database } from '@/lib/supabase/database.types'

// Tipos base de la DB
type MessageRow = Database['public']['Tables']['messages']['Row']
type ConversationRow = Database['public']['Tables']['conversations']['Row']

// Tipos extendidos con campos calculados
export interface Message extends MessageRow {
  profiles?: {
    name: string
    avatar_url: string
  }
}

export interface Conversation extends ConversationRow {
  hasUnread?: boolean
  unreadCount?: number
  lastMessage?: {
    content: string
    created_at: string
  } | null
  items?: {
    title: string
    images: string[]
    sale_price: number
  }
  buyer?: {
    name: string
    avatar_url: string
  }
  seller?: {
    name: string
    avatar_url: string
  }
}