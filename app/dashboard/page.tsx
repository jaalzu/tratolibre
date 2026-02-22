import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { count: objectsCount } = await supabase
    .from('objects')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)

  const { count: reservationsCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .or(`owner_id.eq.${user?.id},renter_id.eq.${user?.id}`)
    .eq('status', 'pending')

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
          {profile?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hola, {profile?.name} 👋</h1>
          <p className="text-sm text-gray-400">Bienvenido a TratoLibre</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/objects"
          className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-green-600">{objectsCount ?? 0}</p>
          <p className="text-sm text-gray-600 mt-1">Objetos publicados</p>
          <p className="text-xs text-green-600 mt-3 font-medium">Ver mis objetos →</p>
        </Link>

        <Link href="/dashboard/reservations"
          className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-yellow-500">{reservationsCount ?? 0}</p>
          <p className="text-sm text-gray-600 mt-1">Reservas pendientes</p>
          <p className="text-xs text-yellow-600 mt-3 font-medium">Ver reservas →</p>
        </Link>

        <Link href="/object/new"
          className="border border-dashed border-gray-200 rounded-2xl p-5 hover:border-green-300 hover:bg-green-50 transition-colors flex flex-col items-center justify-center text-center">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-medium text-gray-600">Publicar objeto</p>
        </Link>
      </div>
    </div>
  )
}