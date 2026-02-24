'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterInput } from '@/features/auth/schemas'
import { registerAction } from '@/features/auth/actions'
import NextLink from 'next/link'
import { Flex, Text, Input, Field, Stack, Checkbox, Box } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'

export const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    const result = await registerAction(null, formData)
    if (result?.error && '_form' in result.error) setServerError(result.error._form[0])
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
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>Crear cuenta</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <Field.Root invalid={!!errors.name}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Nombre y apellido</Field.Label>
            <Input {...register('name')} placeholder="Pepe García" {...inputStyles} />
            {errors.name && <Field.ErrorText fontSize="xs">{errors.name.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Email</Field.Label>
            <Input {...register('email')} type="email" placeholder="tucorreo@gmail.com" {...inputStyles} />
            {errors.email && <Field.ErrorText fontSize="xs">{errors.email.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Contraseña</Field.Label>
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
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                fontSize="xs"
                color="neutral.400"
                cursor="pointer"
                userSelect="none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </Text>
            </Box>
            {errors.password && <Field.ErrorText fontSize="xs">{errors.password.message}</Field.ErrorText>}
          </Field.Root>

          <Flex align="flex-start" gap={2}>
            <Checkbox.Root name="terms" colorPalette="green" mt="2px">
              <Checkbox.HiddenInput />
              <Checkbox.Control borderColor="neutral.300" borderRadius="sm" />
            </Checkbox.Root>
            <Text fontSize="xs" color="neutral.500" lineHeight="tall">
              He leído y acepto las{' '}
              <Text as="span" color="accent.default" fontWeight="600">
                <NextLink href="/terms">Condiciones de uso</NextLink>
              </Text>
              {' '}y{' '}
              <Text as="span" color="accent.default" fontWeight="600">
                <NextLink href="/privacy">Política de privacidad</NextLink>
              </Text>
              {' '}de TratoLibre.
            </Text>
          </Flex>

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">{serverError}</Text>
          )}

          <Button type="submit" width="full" borderRadius="full" py={1} loading={isSubmitting}>
            Crear cuenta
          </Button>
        </Stack>
      </form>

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt="5">
        ¿Ya tenés cuenta?{' '}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login">
            <Text as="span" _hover={{ textDecoration: 'underline' }}>Iniciá sesión</Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  )
}