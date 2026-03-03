import { getItemById } from '@/features/items/actions'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewItemForm } from '@/components/items/newItemForm/NewItemForm'

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [item, { data: { user } }] = await Promise.all([
    getItemById(id),
    supabase.auth.getUser()
  ])

  if (!item) notFound()
  if (!user || user.id !== item.owner_id) redirect(`/item/${id}`)

  return <NewItemForm initialData={item} />
}