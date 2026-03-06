import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import ItemPageContent from '@/features/items/components/publication/ItemPageContent'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await getAuthUser()
  const item = await getItemById(id)

  if (!item) notFound()

  return <ItemPageContent item={item} userId={user?.id ?? null} />
}