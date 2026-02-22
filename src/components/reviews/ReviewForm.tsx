'use client'

import { useActionState, useState } from 'react'
import { createReviewAction } from '@/features/reviews/actions'

export default function ReviewForm({ reservation, userId }: { reservation: any, userId: string }) {
  const [state, formAction] = useActionState<any, FormData>(createReviewAction, null)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const isOwner = reservation.owner_id === userId
  const reviewedId = isOwner ? reservation.renter_id : reservation.owner_id
  const role = isOwner ? 'owner_to_renter' : 'renter_to_owner'

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
        ✓ Review enviada, gracias!
      </div>
    )
  }

  return (
    <form action={formAction} className="border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-gray-700">Dejar review</p>

      <input type="hidden" name="reservation_id" value={reservation.id} />
      <input type="hidden" name="reviewed_id" value={reviewedId} />
      <input type="hidden" name="object_id" value={reservation.object_id} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="rating" value={rating} />

      {/* Estrellas */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            {star <= (hover || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={2}
        placeholder="Contá tu experiencia..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
      />

      {state?.error && typeof state.error === 'string' && (
        <p className="text-red-500 text-xs">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={rating === 0}
        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        Enviar review
      </button>
    </form>
  )
}