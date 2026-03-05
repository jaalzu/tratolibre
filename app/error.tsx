'use client'

import { Box, Text, Flex } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Box minH="100vh" position="relative">
      <Box position="absolute" top={6} left={6}>
        <NextLink href="/">
          <Text fontSize="xl" fontWeight="bold" color="neutral.900">TratoLibre</Text>
        </NextLink>
      </Box>

      <Flex direction="column" align="center" justify="center" minH="100vh" gap={4} px={4}>
        <i className="bx bx-error-circle" style={{ fontSize: '64px', color: 'var(--chakra-colors-feedback-error)' }} />
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900" textAlign="center">
          Algo salió mal
        </Text>
        <Text fontSize="sm" color="neutral.400" textAlign="center" maxW="320px">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </Text>
        <Flex gap={3}>
          <Button borderRadius="full" py={2} px={6} onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button asChild borderRadius="full" py={2} px={6}>
            <NextLink href="/">Volver al inicio</NextLink>
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}