// app/(main)/layout.tsx
import Navbar from "@/components/layout/navigation/Navbar";
import { createClient } from '@/lib/supabase/server';
import BottomNav from "@/components/layout/navigation/BottomNav"; // Importalo

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
      <BottomNav />
    </>
  );
}