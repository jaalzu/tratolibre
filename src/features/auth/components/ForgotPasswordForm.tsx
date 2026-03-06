'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import NextLink from 'next/link'
import { Flex, Text, Input, Field, Stack } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'

const ForgotSchema = z.object({
  email: z.string().email('Email inválido'),
})
type ForgotInput = z.infer<typeof ForgotSchema>

export const ForgotPasswordForm = () => {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotInput>({
    resolver: zodResolver(ForgotSchema),
  })

  const onSubmit = async (data: ForgotInput) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setServerError(error.message)
      return
    }
    setSent(true)
  }

  const inputStyles = {
    borderColor: 'neutral.500',
    borderRadius: 'lg',
    h: '44px',
    px: '3',
    _focus: { borderColor: 'brand.default', boxShadow: 'none' },
    _placeholder: { color: 'neutral.400' },
  }

  if (sent) return (
    <Flex direction="column" maxW="360px" mx="auto" w="full" gap={2}>
      <Text fontSize="xl" fontWeight="bold" color="neutral.900">Revisá tu email</Text>
      <Text fontSize="xs" color="neutral.500">
        Te enviamos un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada y spam.
      </Text>
      <Text fontSize="xs" color="neutral.400" textAlign="center" mt={4}>
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login">
            <Text as="span" _hover={{ textDecoration: 'underline' }}>Volver al inicio de sesión</Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  )

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full">
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>¿Olvidaste tu contraseña?</Text>
      <Text fontSize="xs" color="neutral.400" mb={4}>Ingresá tu email y te enviamos un enlace para restablecerla.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Email</Field.Label>
            <Input {...register('email')} type="email" placeholder="tucorreo@gmail.com" {...inputStyles} />
            {errors.email && <Field.ErrorText fontSize="xs">{errors.email.message}</Field.ErrorText>}
          </Field.Root>

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">{serverError}</Text>
          )}

          <Button type="submit" width="full" borderRadius="full" py={1} loading={isSubmitting}>
            Enviar enlace
          </Button>
        </Stack>
      </form>

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt={5}>
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login">
            <Text as="span" _hover={{ textDecoration: 'underline' }}>Volver al inicio de sesión</Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  )
}