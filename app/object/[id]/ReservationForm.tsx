'use client'

import { useActionState } from 'react'
import { createReservationAction } from '@/features/reservations/actions'
import { useState } from 'react'

export default function ReservationForm({ object }: { object: any }) {
  const [state, formAction] = useActionState<any, FormData>(createReservationAction, null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const days = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0

  const total = days * (object.price_per_day || 0)

  return (
    <div className="border border-gray-100 rounded-2xl p-5 sticky top-20">
      {/* Alquiler */}
      {(object.listing_type === 'rent' || object.listing_type === 'both') && (
        <>
          <p className="text-lg font-bold text-gray-900 mb-4">
            ${object.price_per_day}<span className="text-sm font-normal text-gray-400">/día</span>
          </p>

          <form action={formAction} className="space-y-3">
            <input type="hidden" name="object_id" value={object.id} />

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
              <input
                name="start_date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              {state?.error?.start_date && <p className="text-red-500 text-xs mt-1">{state.error.start_date[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
              <input
                name="end_date"
                type="date"
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              {state?.error?.end_date && <p className="text-red-500 text-xs mt-1">{state.error.end_date[0]}</p>}
            </div>

            {days > 0 && (
              <div className="bg-green-50 rounded-lg p-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>${object.price_per_day} × {days} días</span>
                  <span>${total}</span>
                </div>
                {object.deposit > 0 && (
                  <div className="flex justify-between text-gray-600 mt-1">
                    <span>Depósito</span>
                    <span>${object.deposit}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 mt-2 pt-2 border-t border-green-100">
                  <span>Total</span>
                  <span>${total + (object.deposit || 0)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mensaje al owner <span className="text-gray-400">(opcional)</span></label>
              <textarea
                name="message"
                rows={2}
                placeholder="Contale para qué lo necesitás..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {state?.error && typeof state.error === 'string' && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}

            <button type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
              Solicitar alquiler
            </button>
          </form>
        </>
      )}

      {/* Venta */}
      {(object.listing_type === 'sell' || object.listing_type === 'both') && (
        <div className={object.listing_type === 'both' ? 'mt-4 pt-4 border-t border-gray-100' : ''}>
          <p className="text-lg font-bold text-gray-900 mb-1">${object.sale_price}</p>
          <p className="text-xs text-gray-400 mb-3">Precio de venta</p>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            Consultar compra
          </button>
        </div>
      )}
    </div>
  )
}