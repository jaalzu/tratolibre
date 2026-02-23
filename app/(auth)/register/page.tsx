'use client'

import { registerAction } from '@/features/auth/actions'
import { useActionState } from 'react'
import NextLink from 'next/link'
import { Flex, Text, Input, Field, Stack } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function RegisterPage() {
  const [state, formAction] = useActionState<any, FormData>(registerAction, null)

  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card p="8" w="full" maxW="440px" shadow="base" borderRadius="lg">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900" mb="1">
          Crear cuenta
        </Text>
        <Text fontSize="sm" color="neutral.400" mb="6">
          Empezá a comprar y vender objetos
        </Text>

        <form action={formAction}>
          <Stack gap="4">

            {/* Nombre */}
            <Field.Root invalid={!!state?.error?.name}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">
                Nombre
              </Field.Label>
              <Input 
                name="name" 
                placeholder="Tu nombre" 
                borderColor="neutral.100"
                _focus={{ borderColor: "brand.default", boxShadow: "focus" }}
              />
              {state?.error?.name && (
                <Field.ErrorText fontSize="xs" color="feedback.error">
                  {state.error.name[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* Email */}
            <Field.Root invalid={!!state?.error?.email}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">
                Email
              </Field.Label>
              <Input 
                name="email" 
                type="email" 
                placeholder="tu@email.com" 
                borderColor="neutral.100"
                _focus={{ borderColor: "brand.default", boxShadow: "focus" }}
              />
              {state?.error?.email && (
                <Field.ErrorText fontSize="xs" color="feedback.error">
                  {state.error.email[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* Password */}
            <Field.Root invalid={!!state?.error?.password}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">
                Contraseña
              </Field.Label>
              <Input 
                name="password" 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                borderColor="neutral.100"
                _focus={{ borderColor: "brand.default", boxShadow: "focus" }}
              />
              {state?.error?.password && (
                <Field.ErrorText fontSize="xs" color="feedback.error">
                  {state.error.password[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {state?.error?._form && (
              <Text fontSize="sm" color="feedback.error" textAlign="center">
                {state.error._form[0]}
              </Text>
            )}

            <Button type="submit" width="full" mt="2">
              Crear cuenta
            </Button>

          </Stack>
        </form>

        <Text fontSize="sm" color="neutral.400" textAlign="center" mt="6">
          ¿Ya tenés cuenta?{' '}
          <NextLink 
            href="/login" 
            style={{ color: 'var(--colors-brand-default)', fontWeight: 600 }}
          >
            Iniciá sesión
          </NextLink>
        </Text>
      </Card>
    </Flex>
  )
}