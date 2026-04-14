import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getUserFavorites } from "@/features/items/actions";
import { redirect } from "next/navigation";
import { FavoritesView } from "@/features/favorites/FavoritesView";
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  const favorites = await getUserFavorites();

  return <FavoritesView initialFavorites={favorites} userId={user.id} />;
}
