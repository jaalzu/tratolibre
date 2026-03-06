import { getItemById } from '@/features/items/actions'
import { notFound, redirect } from 'next/navigation'
import { NewItemForm } from '@/features/items/components/newItemForm/NewItemForm'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await getAuthUser()
  const item = await getItemById(id)

  if (!item) notFound()
  if (!user || user.id !== item.owner_id) redirect(`/item/${id}`)

  return <NewItemForm initialData={item} />
}