import { getObjectById } from '@/features/objects/actions'
import { notFound } from 'next/navigation'
import ReservationForm from './ReservationForm'

export default async function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const object = await getObjectById(id)
  if (!object) notFound()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna izquierda — info */}
        <div className="lg:col-span-2">
          {object.images?.length > 0 && (
            <div className="flex gap-2 mb-6 overflow-x-auto rounded-xl">
              {object.images.map((url: string, i: number) => (
                <img key={i} src={url} className="w-full h-64 object-cover rounded-xl flex-shrink-0" />
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{object.title}</h1>
          <p className="text-gray-400 text-sm mb-4">{object.location}, {object.city}</p>

          <div className="flex gap-3 mb-6">
            {object.price_per_day && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-xs text-green-600 font-medium">Alquiler</p>
                <p className="text-xl font-bold text-green-700">${object.price_per_day}<span className="text-sm font-normal">/día</span></p>
              </div>
            )}
            {object.sale_price && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-xs text-blue-600 font-medium">Venta</p>
                <p className="text-xl font-bold text-blue-700">${object.sale_price}</p>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{object.description}</p>

          {object.rules && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-1">Condiciones del owner</p>
              <p className="text-sm text-gray-500">{object.rules}</p>
            </div>
          )}

          <div className="flex items-center gap-3 border-t pt-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
              {object.profiles?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{object.profiles?.name}</p>
              <p className="text-xs text-gray-400">⭐ {object.profiles?.rating || 'Sin reviews aún'} · {object.profiles?.reviews_count || 0} reviews</p>
            </div>
          </div>
        </div>

        {/* Columna derecha — formulario */}
        <div className="lg:col-span-1">
          <ReservationForm object={object} />
        </div>

      </div>
    </div>
  )
}