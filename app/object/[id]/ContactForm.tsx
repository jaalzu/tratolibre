'use client'

import { useState } from 'react'
import { getOrCreateConversation } from '@/features/conversations/actions'
import { useRouter } from 'next/navigation'

export default function ContactForm({ object, userId }: { object: any, userId: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction(type: 'buy' | 'offer') {
    if (!userId) return router.push('/login')
    setLoading(true)
    const result = await getOrCreateConversation(object.id, object.profiles?.id)
    if (result.data) {
      router.push(`/dashboard/messages?conversation=${result.data.id}&type=${type}`)
    }
    setLoading(false)
  }

  if (!userId) {
    return (
      <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
        <p className="text-2xl font-bold text-gray-900">${object.sale_price?.toLocaleString('es-AR')}</p>
        <p className="text-sm text-gray-500 text-center">Iniciá sesión para contactar al vendedor</p>
        <a href="/login"
          className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
          Iniciar sesión
        </a>
      </div>
    )
  }

  if (object.profiles?.id === userId) {
    return (
      <div className="border border-gray-100 rounded-2xl p-5">
        <p className="text-2xl font-bold text-gray-900 mb-1">${object.sale_price?.toLocaleString('es-AR')}</p>
        <p className="text-sm text-gray-400 text-center mt-4">Este es tu objeto</p>
      </div>
    )
  }

  if (object.sold) {
    return (
      <div className="border border-gray-100 rounded-2xl p-5">
        <p className="text-2xl font-bold text-gray-900 mb-1">${object.sale_price?.toLocaleString('es-AR')}</p>
        <p className="text-sm text-red-500 font-medium mt-2">Este objeto ya fue vendido</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-5 sticky top-20 space-y-4">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{object.title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">${object.sale_price?.toLocaleString('es-AR')}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleAction('buy')}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm transition-colors">
          Comprar
        </button>
        <button
          onClick={() => handleAction('offer')}
          disabled={loading}
          className="w-full border border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 font-medium py-3 rounded-xl text-sm transition-colors">
          Hacer oferta
        </button>
      </div>
    </div>
  )
}