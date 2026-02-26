export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  profiles?: {
    name: string
    avatar_url: string
  }
}
export interface Conversation {
  id: string
  item_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
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

export interface Offer {
  id: string
  item_id: string
  buyer_id: string
  seller_id: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  message?: string
  created_at: string
  updated_at: string
  items?: {
    title: string
    images: string[]
    sale_price: number
  }
  profiles?: {
    name: string
    avatar_url: string
  }
}