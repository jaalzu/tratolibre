'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { RegisterCollage } from './RegisterCollage'
import NextLink from 'next/link'
import Image from 'next/image'

const socialButtons = [
  { label: 'Continuar con Google', icon: '/svg/google.svg', href: null },
  { label: 'Continuar con Facebook', icon: '/svg/facebook.svg', href: null },
  { label: 'Continuar con email', icon: '/svg/email.svg', href: '/register/email' },
]

export const RegisterOptions = () => {
  const inner = (icon: string, label: string) => (
    <Box
      display="grid"
      gridTemplateColumns="33px 1fr"
      alignItems="center"
      w="50%"
      mx="auto"
    >
      <Box w="17px" h="17px" position="relative" justifySelf="center">
        <Image src={icon} alt={label} fill style={{ objectFit: 'contain' }} />
      </Box>
      <Text fontSize="xs" fontWeight="medium" textAlign="left">{label}</Text>
    </Box>
  )

  return (
    <Flex direction="column" gap={4}>
      <RegisterCollage />

     <Flex direction="column" gap={0}>
  <Text fontSize="md" fontWeight="bold" color="neutral.900">Registrate o Iniciá sesión.</Text>
  <Text fontSize="md" fontWeight="bold" color="brand.dark">¡Te estamos esperando en TratoLibre!</Text>
</Flex>

      <Flex direction="column" gap={2.5}>
        {socialButtons.map(({ label, icon, href }) => (
          <Button
            key={label}
            py={1.5}
            width="full"
            variant="secondary"
            borderRadius="full"
            asChild={!!href}
          >
            {href
              ? <NextLink href={href}>{inner(icon, label)}</NextLink>
              : inner(icon, label)
            }
          </Button>
        ))}
      </Flex>

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