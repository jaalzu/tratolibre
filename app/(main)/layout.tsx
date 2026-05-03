import Navbar from "@/components/layout/navigation/Navbar";
import BottomNav from "@/components/layout/navigation/BottomNav";
import { FooterWrapper } from "@/components/layout/footer/FooterWrapper";
import { getUnreadCount } from "@/features/notifications";
import { getAuthUserWithRole } from "@/lib/supabase/utils/auth-helpers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await getAuthUserWithRole();
  const unreadCount = user ? await getUnreadCount() : 0;

  return (
    <>
      <Navbar
        user={user}
        unreadCount={unreadCount}
        isAdmin={role === "admin"}
      />
      <main>{children}</main>
      <FooterWrapper />
      <BottomNav userId={user?.id} isAdmin={role === "admin"} />
    </>
  );
}
