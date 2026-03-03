import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ItemPageContent from '@/components/items/publication/ItemPageContent'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [item, { data: { user } }] = await Promise.all([
    getItemById(id),
    supabase.auth.getUser()
  ])

  if (!item) notFound()

  return <ItemPageContent item={item} userId={user?.id ?? null} />
}