import { Box, Text, Flex } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

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
        <img src="/404.webp" alt="Perro comiendo la página" style={{ width: '220px', borderRadius: '16px' }} />
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900" textAlign="center">
          ¡Parece que un perro se comió esta página!
        </Text>
        <Text fontSize="sm" color="neutral.400" textAlign="center" maxW="320px">
          No encontramos lo que buscabas. Quizás ya no existe o nunca existió.
        </Text>
        <Button asChild borderRadius="full" py={1} px={6}>
          <NextLink href="/">Volver al inicio</NextLink>
        </Button>
      </Flex>
    </Box>
  )
}