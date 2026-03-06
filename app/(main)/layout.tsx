import Navbar from "@/components/layout/navigation/Navbar";
import BottomNav from "@/components/layout/navigation/BottomNav";
import { FooterWrapper } from '@/components/layout/footer/FooterWrapper'
import { getUnreadCount } from '@/features/notifications/actions'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthUser()

  const unreadCount = user ? await getUnreadCount() : 0

  return (
    <>
      <Navbar user={user} unreadCount={unreadCount} />
      <main>{children}</main>
      <FooterWrapper />
      <BottomNav userId={user?.id} />
    </>
  );
}