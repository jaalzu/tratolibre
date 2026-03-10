// app/(main)/item/[id]/page.tsx
import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import ItemPageContent from '@/features/items/components/publication/ItemPageContent'
import { getAuthUserWithRole } from '@/lib/supabase/getAuthUserWithRole'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, role } = await getAuthUserWithRole()
  const item = await getItemById(id)

  if (!item) notFound()

  return (
    <ItemPageContent
      item={item}
      userId={user?.id ?? null}
      isAdmin={role === 'admin'}
    />
  )
}