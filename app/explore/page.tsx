import { getObjects } from '@/features/objects/actions'
import Link from 'next/link'
import { CATEGORIES } from '@/features/objects/utils'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; city?: string; listing_type?: string }>
}) {
  const params = await searchParams
  const objects = await getObjects(params)

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explorar objetos</h1>

      {/* Filtros */}
      <form className="flex flex-wrap gap-3 mb-8">
        <input
          name="query"
          defaultValue={params.query}
          placeholder="Buscar..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        <select name="category" defaultValue={params.category}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
        <select name="listing_type" defaultValue={params.listing_type}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Alquiler y venta</option>
          <option value="rent">Solo alquiler</option>
          <option value="sell">Solo venta</option>
          <option value="both">Ambos</option>
        </select>
        <input
          name="city"
          defaultValue={params.city}
          placeholder="Ciudad..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Buscar
        </button>
        {(params.query || params.category || params.city || params.listing_type) && (
          <Link href="/explore"
            className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2">
            Limpiar
          </Link>
        )}
      </form>

      {/* Resultados */}
      {objects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No encontramos objetos</p>
          <p className="text-sm mt-1">Probá con otros filtros</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {objects.map((obj: any) => (
          <Link key={obj.id} href={`/object/${obj.id}`}
            className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            {obj.images?.[0] ? (
              <img src={obj.images[0]} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-4xl">📦</div>
            )}
            <div className="p-4">
              <p className="font-medium text-gray-900 truncate">{obj.title}</p>
              <p className="text-sm text-gray-400 mt-0.5">{obj.city}</p>
              <div className="flex gap-2 mt-2">
                {obj.price_per_day && (
                  <span className="text-sm font-semibold text-green-600">${obj.price_per_day}/día</span>
                )}
                {obj.sale_price && (
                  <span className="text-sm font-semibold text-blue-600">${obj.sale_price}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-gray-400">⭐ {obj.profiles?.rating || '—'}</span>
                <span className="text-xs text-gray-300 mx-1">·</span>
                <span className="text-xs text-gray-400">{obj.profiles?.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}