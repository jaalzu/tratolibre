import { createClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/messages/ChatWindow'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Traer todas las reservas donde participo
  const { data: reservations } = await supabase
  .from('reservations')
  .select('*, objects(title, images)')
  .or(`owner_id.eq.${user?.id},renter_id.eq.${user?.id}`)
  .order('updated_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mensajes</h1>

      {!reservations?.length && (
        <p className="text-gray-400 text-sm">No tenés conversaciones activas todavía</p>
      )}

      <div className="space-y-8">
        {reservations?.map((res: any) => (
          <div key={res.id}>
            <div className="flex items-center gap-3 mb-3">
              {res.objects?.images?.[0] && (
                <img src={res.objects.images[0]} className="w-10 h-10 rounded-lg object-cover" />
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">{res.objects?.title}</p>
                <p className="text-xs text-gray-400">{res.start_date} → {res.end_date}</p>
              </div>
            </div>
            <ChatWindow reservationId={res.id} userId={user?.id!} />
          </div>
        ))}
      </div>
    </div>
  )
}