import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteObjectAction } from '@/features/objects/actions'

export default async function MyObjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: objects } = await supabase
    .from('objects')
    .select('*')
    .eq('owner_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis objetos</h1>
        <Link href="/object/new"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Publicar objeto
        </Link>
      </div>

      {objects?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium">No publicaste nada todavía</p>
          <Link href="/object/new" className="text-green-600 text-sm mt-1 inline-block hover:underline">
            Publicá tu primer objeto
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {objects?.map(obj => (
          <div key={obj.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 items-center">
            {obj.images?.[0] && (
              <img src={obj.images[0]} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{obj.title}</p>
              <p className="text-sm text-gray-400">{obj.city} · {obj.listing_type === 'rent' ? 'Alquiler' : obj.listing_type === 'sell' ? 'Venta' : 'Alquiler y venta'}</p>
              {obj.price_per_day && <p className="text-sm text-green-600 font-medium">${obj.price_per_day}/día</p>}
              {obj.sale_price && <p className="text-sm text-blue-600 font-medium">${obj.sale_price}</p>}
            </div>
            <div className="flex gap-2">
              <Link href={`/object/${obj.id}`}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
                Ver
              </Link>
             <form action={async () => { 'use server'; await deleteObjectAction(obj.id) }}>
  <button type="submit"
    className="text-sm text-red-500 hover:text-red-700 border border-red-100 px-3 py-1.5 rounded-lg">
    Eliminar
  </button>
</form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}