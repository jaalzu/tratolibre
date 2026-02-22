import { getMyReservations } from '@/features/reservations/actions'
import { updateReservationStatusAction } from '@/features/reservations/actions'
import ReviewForm from '@/components/reviews/ReviewForm'
import { createClient } from '@/lib/supabase/server'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700' },
  accepted:  { label: 'Aceptada',   color: 'bg-green-100 text-green-700' },
  rejected:  { label: 'Rechazada',  color: 'bg-red-100 text-red-700' },
  active:    { label: 'En curso',   color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelada',  color: 'bg-red-100 text-red-700' },
}

export default async function ReservationsPage() {
  const { asRenter, asOwner } = await getMyReservations()
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis reservas</h1>

      {/* Como owner — solicitudes recibidas */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Solicitudes recibidas</h2>
        {asOwner.length === 0 ? (
          <p className="text-gray-400 text-sm">No recibiste solicitudes todavía</p>
        ) : (
          <div className="space-y-4">
            {asOwner.map((res: any) => (
              <div key={res.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    {res.objects?.images?.[0] && (
                      <img src={res.objects.images[0]} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{res.objects?.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {res.start_date} → {res.end_date} · ${res.total_price}
                      </p>
                      {res.message && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{res.message}"</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${STATUS_LABELS[res.status]?.color}`}>
                    {STATUS_LABELS[res.status]?.label}
                  </span>
                </div>

                {res.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <form action={async () => {
                      'use server'
                      await updateReservationStatusAction(res.id, 'accepted')
                    }}>
                      <button type="submit"
                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition-colors">
                        Aceptar
                      </button>
                    </form>
                    <form action={async () => {
                      'use server'
                      await updateReservationStatusAction(res.id, 'rejected')
                    }}>
                      <button type="submit"
                        className="text-sm border border-red-200 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors">
                        Rechazar
                      </button>
                    </form>
                  </div>
                )}

                {res.status === 'accepted' && (
                  <form action={async () => {
                    'use server'
                    await updateReservationStatusAction(res.id, 'active')
                  }} className="mt-3">
                    <button type="submit"
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors">
                      Marcar como entregado
                    </button>
                  </form>
                )}

                {res.status === 'active' && (
                  <form action={async () => {
                    'use server'
                    await updateReservationStatusAction(res.id, 'completed')
                  }} className="mt-3">
                    <button type="submit"
                      className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg transition-colors">
                      Marcar como devuelto
                    </button>
                  </form>
                )}
                {res.status === 'completed' && (
  <div className="mt-3">
    <ReviewForm reservation={res} userId={user?.id!} />
  </div>
)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Como renter — mis solicitudes */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Mis solicitudes</h2>
        {asRenter.length === 0 ? (
          <p className="text-gray-400 text-sm">No hiciste ninguna solicitud todavía</p>
        ) : (
          <div className="space-y-4">
            {asRenter.map((res: any) => (
              <div key={res.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    {res.objects?.images?.[0] && (
                      <img src={res.objects.images[0]} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{res.objects?.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {res.start_date} → {res.end_date} · ${res.total_price}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${STATUS_LABELS[res.status]?.color}`}>
                    {STATUS_LABELS[res.status]?.label}
                  </span>
                </div>

                {res.status === 'pending' && (
                  <form action={async () => {
                    'use server'
                    await updateReservationStatusAction(res.id, 'cancelled')
                  }} className="mt-3">
                    <button type="submit"
                      className="text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 px-4 py-1.5 rounded-lg transition-colors">
                      Cancelar solicitud
                    </button>
                  </form>
                )}
                
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}