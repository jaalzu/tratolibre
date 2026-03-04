import { getMyNotifications } from '@/features/notifications/actions'
import { NotificationsList } from '@/features/notifications/NotificationsList'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export default async function NotificationsPage() {
  const { user } = await getAuthUser()
  if (!user) redirect('/login')

  const notifications = await getMyNotifications()

  return <NotificationsList notifications={notifications} />
}