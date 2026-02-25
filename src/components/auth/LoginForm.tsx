// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, LoginInput } from '@/features/auth/schemas'
import NextLink from 'next/link'
import { Flex, Text, Input, Field, Stack, Box } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SocialButtons } from '@/components/auth/SocialButtons'


export const LoginForm = () => {
      const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError('Email o contraseña incorrectos')
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
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>Bienvenido</Text>
      <Text fontSize="xs" color="neutral.400" mb={4}>Iniciá sesión en TratoLibre</Text>


      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
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
                placeholder="Tu contraseña"
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

          <Text fontSize="xs" color="accent.default" textAlign="right" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
            <NextLink href="/forgot-password">¿Olvidaste tu contraseña?</NextLink>
          </Text>

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">{serverError}</Text>
          )}

          <Button type="submit" width="full" borderRadius="full" py={1} loading={isSubmitting}>
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Flex align="center" gap={3} my={4}>
        <Box flex={1} h="1px" bg="neutral.200" />
        <Text fontSize="xs" color="neutral.400">o continuá con</Text>
        <Box flex={1} h="1px" bg="neutral.200" />
      </Flex>

      <SocialButtons />

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt="5">
        ¿No tenés cuenta?{' '}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/register">
            <Text as="span" _hover={{ textDecoration: 'underline' }}>Registrate</Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  )
}