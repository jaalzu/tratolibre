import { getItems, getUserFavoriteIds } from '@/features/items/actions'
import { getUserProvince } from '@/features/profile/actions'
import { ItemsCategorySection } from './ItemsCategorySection'

export async function NearbyItemsSection({ userId }: { userId: string | null }) {
  if (!userId) return null

  const [province, favoriteIds] = await Promise.all([
    getUserProvince(userId),
    getUserFavoriteIds(userId),
  ])

  if (!province) return null

  const items = await getItems({ province })

  return (
    <ItemsCategorySection
      title="Cerca tuyo"
      items={items.slice(0, 13)}
      viewMoreHref={`/search?province=${encodeURIComponent(province)}`}
      userId={userId}
      favoriteIds={favoriteIds}
    />
  )
}