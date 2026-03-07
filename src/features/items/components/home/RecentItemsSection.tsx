import { getItems, getUserFavoriteIds } from '@/features/items/actions'
import { ItemsCategorySection } from './ItemsCategorySection'

export async function RecentItemsSection({ userId }: { userId: string | null }) {
  const [items, favoriteIds] = await Promise.all([
    getItems(),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([])
  ])

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={items.slice(0, 13)}
      viewMoreHref="/"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  )
}