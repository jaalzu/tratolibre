import Navbar from "@/components/layout/navigation/Navbar";
import { createClient } from '@/lib/supabase/server';
import BottomNav from "@/components/layout/navigation/BottomNav";
import { FooterWrapper } from '@/components/layout/footer/FooterWrapper'
import { getUnreadCount } from '@/features/notifications/actions'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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