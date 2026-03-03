import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewItemForm } from '@/components/items/newItemForm/NewItemForm'
import { redirect } from 'next/navigation'

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItemById(id)
  if (!item) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Solo el owner puede editar
  if (!user || user.id !== item.owner_id) redirect(`/item/${id}`)

  return <NewItemForm initialData={item} />
}