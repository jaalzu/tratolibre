// app/(main)/favorites/page.tsx
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getUserFavorites } from "@/features/items/actions";
import { redirect } from "next/navigation";
import { FavoritesView } from "@/features/favorites/FavoritesView";

export default async function FavoritesPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  // Traemos los datos en el servidor (más rápido)
  const favorites = await getUserFavorites();

  return <FavoritesView initialFavorites={favorites} userId={user.id} />;
}
