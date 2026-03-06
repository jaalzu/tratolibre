import { getItems, getUserFavoriteIds } from '@/features/items/actions'
import { ItemsCategorySection } from './ItemsCategorySection'

export async function NewItemsSection({ userId }: { userId: string | null }) {
  const [items, favoriteIds] = await Promise.all([
    getItems({ condition: 'new' }),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ])

  return (
    <ItemsCategorySection
      title="Artículos nuevos"
      items={items.slice(0, 13)}
      viewMoreHref="/search?condition=new"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  )
}