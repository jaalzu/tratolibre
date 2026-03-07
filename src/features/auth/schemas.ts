import { z } from 'zod'
import { nameSchema } from '@/lib/validations/name'

export const RegisterSchema = z.object({
  firstName: nameSchema,
  lastName:  nameSchema,
  email:     z.string().email('Email inválido'),
  password:  z.string().min(8, 'Mínimo 8 caracteres'),
})

export const LoginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput    = z.infer<typeof LoginSchema>