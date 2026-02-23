import { z } from 'zod'

export const ObjectSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(80),
  description: z.string().min(20, 'Describilo bien').max(1000),
  category: z.string().min(1, 'Elegí una categoría'),
  sale_price: z.coerce.number().min(1, 'Ingresá el precio'),
  location: z.string().min(3, 'Indicá el barrio o zona'),
  city: z.string().min(2, 'Indicá la ciudad'),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  rules: z.string().optional(),
  images: z.array(z.string()).min(1, 'Al menos 1 foto').max(8),
})

export type ObjectInput = z.infer<typeof ObjectSchema>