import { Database } from '@/lib/supabase/database.types'

export type NotificationRow = Database['public']['Tables']['notifications']['Row']

export type NotificationType = 'sale_completed' | 'purchase_completed' | 'review_received'

export type Notification = Omit<NotificationRow, 'type' | 'data'> & {
  type: NotificationType
  data: Record<string, unknown>
}