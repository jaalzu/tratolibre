import { z } from 'zod'

export const ItemSchema = z.object({
  title:       z.string().min(5, 'Mínimo 5 caracteres').max(80),
  description: z.string().min(20, 'Describilo bien').max(1000),
  category:    z.string().min(1, 'Elegí una categoría'),
  condition:   z.enum(['new', 'like_new', 'good', 'fair']),
  sale_price:  z.coerce.number().min(1, 'El precio mínimo es $1'),
  province:    z.string().min(1, 'Elegí una provincia'),
  city:        z.string().optional(),
  location:    z.string().optional(),
  images:      z.array(z.string()).min(1, 'Al menos 1 foto').max(4, 'Máximo 4 fotos'),
})

export type ItemInput = z.infer<typeof ItemSchema>