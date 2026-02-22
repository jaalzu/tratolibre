import { z } from 'zod'

export const ObjectSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(80),
  description: z.string().min(20, 'Describilo bien').max(1000),
  category: z.string().min(1, 'Elegí una categoría'),
  listing_type: z.enum(['rent', 'sell', 'both']),
  price_per_day: z.coerce.number().optional(),
  sale_price: z.coerce.number().optional(),
  deposit: z.coerce.number().min(0).default(0),
  location: z.string().min(3, 'Indicá el barrio o zona'),
  city: z.string().min(2, 'Indicá la ciudad'),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  rules: z.string().optional(),
  images: z.array(z.string()).min(1, 'Al menos 1 foto').max(8),
}).refine(data => {
  if (data.listing_type === 'rent' || data.listing_type === 'both') {
    return !!data.price_per_day && data.price_per_day > 0
  }
  return true
}, { message: 'Ingresá el precio por día', path: ['price_per_day'] })
.refine(data => {
  if (data.listing_type === 'sell' || data.listing_type === 'both') {
    return !!data.sale_price && data.sale_price > 0
  }
  return true
}, { message: 'Ingresá el precio de venta', path: ['sale_price'] })

export type ObjectInput = z.infer<typeof ObjectSchema>