'use client'

import { loginAction } from '@/features/auth/actions'
import { useActionState } from 'react'
import NextLink from 'next/link'
import { Flex, Text, Input, Field, Stack } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const [state, formAction] = useActionState<any, FormData>(loginAction, null)

  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card p={8} w="100%" maxW="440px">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900" mb={1}>
          Bienvenido
        </Text>
        <Text fontSize="sm" color="neutral.400" mb={6}>
          Iniciá sesión en TratoLibre
        </Text>

        <form action={formAction}>
          <Stack gap={4}>
            
            <Field.Root invalid={!!state?.error?.email}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">
                Email
              </Field.Label>
              <Input 
                name="email" 
                type="email" 
                placeholder="tu@email.com" 
                borderColor="neutral.100"
                _focus={{ borderColor: "brand.default", ring: "1px", ringColor: "brand.default" }}
              />
              {state?.error?.email && (
                <Field.ErrorText fontSize="xs" color="feedback.error" mt={1}>
                  {state.error.email[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!state?.error?.password}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">
                Contraseña
              </Field.Label>
              <Input 
                name="password" 
                type="password" 
                placeholder="Tu contraseña" 
                borderColor="neutral.100"
                _focus={{ borderColor: "brand.default", ring: "1px", ringColor: "brand.default" }}
              />
              {state?.error?.password && (
                <Field.ErrorText fontSize="xs" color="feedback.error" mt={1}>
                  {state.error.password[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {state?.error?._form && (
              <Text fontSize="sm" color="feedback.error" textAlign="center">
                {state.error._form[0]}
              </Text>
            )}

            <Button type="submit" width="full" mt={2}>
              Iniciar sesión
            </Button>

          </Stack>
        </form>

        <Text fontSize="sm" color="neutral.400" textAlign="center" mt={6}>
          ¿No tenés cuenta?{' '}
          <NextLink href="/register" style={{ color: 'var(--colors-brand-default)', fontWeight: 600 }}>
            Registrate
          </NextLink>
        </Text>
      </Card>
    </Flex>
  )
}