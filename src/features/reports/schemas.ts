// features/reports/schemas.ts
import { z } from 'zod'

export const ReportSchema = z.object({
  type: z.enum(['item', 'conversation', 'user']),
  target_id: z.string().uuid(),
  reason: z.enum([
    'contenido_inapropiado',
    'spam',
    'producto_ilegal',
    'estafa',
    'acoso',
    'otro',
  ]),
  description: z.string().max(500).optional(),
})

export type ReportInput = z.infer<typeof ReportSchema>

export const REPORT_REASONS = [
  { value: 'contenido_inapropiado', label: 'Contenido inapropiado u ofensivo' },
  { value: 'spam',                  label: 'Spam o publicidad engañosa' },
  { value: 'producto_ilegal',       label: 'Producto falsificado o ilegal' },
  { value: 'estafa',                label: 'Estafa o fraude' },
  { value: 'acoso',                 label: 'Acoso o comportamiento abusivo' },
  { value: 'otro',                  label: 'Otro' },
] as const