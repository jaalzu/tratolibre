'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Flex, Text, Input, Field, Stack, Box } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'

const ResetSchema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})
type ResetInput = z.infer<typeof ResetSchema>

export const ResetPasswordForm = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetInput>({
    resolver: zodResolver(ResetSchema),
  })

  const onSubmit = async (data: ResetInput) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) {
      setServerError(error.message)
      return
    }
    router.push('/')
    router.refresh()
  }

  const inputStyles = {
    borderColor: 'neutral.500',
    borderRadius: 'lg',
    h: '44px',
    px: '3',
    _focus: { borderColor: 'brand.default', boxShadow: 'none' },
    _placeholder: { color: 'neutral.400' },
  }

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full">
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>Nueva contraseña</Text>
      <Text fontSize="xs" color="neutral.400" mb={4}>Ingresá tu nueva contraseña.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <Field.Root invalid={!!errors.password}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Nueva contraseña</Field.Label>
            <Box position="relative" w="full">
              <Input
                w="full"
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                {...inputStyles}
                pr="40px"
              />
              <Text
                position="absolute" right="12px" top="50%" transform="translateY(-50%)"
                fontSize="xs" color="neutral.400" cursor="pointer" userSelect="none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </Text>
            </Box>
            {errors.password && <Field.ErrorText fontSize="xs">{errors.password.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.confirm}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Confirmá la contraseña</Field.Label>
            <Input {...register('confirm')} type="password" placeholder="Repetí tu contraseña" {...inputStyles} />
            {errors.confirm && <Field.ErrorText fontSize="xs">{errors.confirm.message}</Field.ErrorText>}
          </Field.Root>

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">{serverError}</Text>
          )}

          <Button type="submit" width="full" borderRadius="full" py={1} loading={isSubmitting}>
            Guardar contraseña
          </Button>
        </Stack>
      </form>
    </Flex>
  )
}