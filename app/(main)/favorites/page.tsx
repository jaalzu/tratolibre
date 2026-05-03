import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { getUserFavorites } from "@/features/items/actions";
import { redirect } from "next/navigation";
import { FavoritesView } from "@/features/favorites/FavoritesView";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  const result = await getUserFavorites();

  const favorites = result.success ? result.data : [];

  if (!result.success) {
    console.error("Error cargando favoritos:", result.error);
  }

  return <FavoritesView initialFavorites={favorites} userId={user.id} />;
}
