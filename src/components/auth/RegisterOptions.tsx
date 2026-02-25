'use client'

import { Flex, Text } from '@chakra-ui/react'
import { RegisterCollage } from './RegisterCollage'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { SocialButtons } from '@/components/auth/SocialButtons'

export const RegisterOptions = () => {
  const router = useRouter()

  return (
    <Flex direction="column" gap={4}>
      <RegisterCollage />

      <Flex direction="column">
        <Text fontSize="md" fontWeight="bold" color="neutral.900" lineHeight="tight">Registrate totalmente gratis.</Text>
        <Text fontSize="md" fontWeight="bold" color="brand.dark" lineHeight="tight">¡Te estamos esperando en TratoLibre!</Text>
      </Flex>

      <SocialButtons showEmail onEmailClick={() => router.push('/register/email')} />

      <Text fontSize="sm" color="neutral.700" textAlign="center">
        ¿Ya tenés cuenta?{' '}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login" style={{ textDecoration: 'none' }}>
            <Text as="span" _hover={{ textDecoration: 'underline' }}>Iniciá sesión</Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  )
}