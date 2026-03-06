'use client'

import { Box, Text, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'

export default function NotFound() {
  return (
    <Box minH="100vh" position="relative">
      {/* Logo */}
      <Box position="absolute" top={6} left={6}>
        <NextLink href="/">
          <Text fontSize="xl" fontWeight="bold" color="neutral.900">TratoLibre</Text>
        </NextLink>
      </Box>
       

      <Flex direction="column" align="center" justify="center" minH="100vh" gap={4} px={4}>
      <EmptyState
  image="/404.webp"
  imageAlt="Perro comiendo la página"
  title="¡Parece que un perro se comió esta página!"
  description="No encontramos lo que buscabas. Quizás ya no existe o nunca existió."
  actionLabel="Volver al inicio"
  actionHref="/"
/>
      </Flex>
    </Box>
  )
}