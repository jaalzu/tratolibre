import Link from 'next/link'
import { getObjects } from '@/features/objects/actions'
import { CATEGORIES } from '@/features/objects/utils'

export default async function HomePage() {
  const objects = await getObjects()
  const recent = objects.slice(0, 6)

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alquilá o comprá lo que necesitás
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Conectamos personas que tienen objetos sin usar con quienes los necesitan. Simple, seguro y local.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/explore"
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
            Explorar objetos
          </Link>
          <Link href="/object/new"
            className="border border-gray-200 hover:border-green-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors">
            Publicar objeto
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
          {CATEGORIES.map(c => (
            <Link key={c.id} href={`/explore?category=${c.id}`}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors text-center">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-xs text-gray-600">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos objetos */}
      {recent.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Últimos publicados</h2>
            <Link href="/explore" className="text-sm text-green-600 hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((obj: any) => (
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}