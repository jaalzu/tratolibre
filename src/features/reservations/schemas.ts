import { z } from 'zod'

export const ReservationSchema = z.object({
  object_id: z.string().uuid(),
  start_date: z.string().min(1, 'Elegí una fecha de inicio'),
  end_date: z.string().min(1, 'Elegí una fecha de fin'),
  message: z.string().optional(),
}).refine(data => {
  const start = new Date(data.start_date)
  const end = new Date(data.end_date)
  return end > start
}, { message: 'La fecha de fin debe ser posterior a la de inicio', path: ['end_date'] })

export type ReservationInput = z.infer<typeof ReservationSchema>