import { Box, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/features/auth/actions'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Box as="nav" borderBottomWidth="1px" borderColor="neutral.100" bg="white" position="sticky" top={0} zIndex={50}>
      <Flex maxW="1280px" mx="auto" px={4} h="56px" align="center" justify="space-between">

        <NextLink href="/">
          <Text fontWeight="bold" fontSize="lg" color="brand.default">TratoLibre</Text>
        </NextLink>

        <Flex align="center" gap={6} fontSize="sm">
          <NextLink href="/explore">Explorar</NextLink>

          {user ? (
            <>
              <NextLink href="/object/new">Publicar</NextLink>
              <NextLink href="/dashboard/messages">Mensajes</NextLink>
              <NextLink href="/dashboard">Dashboard</NextLink>
              <form action={logoutAction}>
                <button type="submit">Salir</button>
              </form>
            </>
          ) : (
            <>
              <NextLink href="/login">Iniciar sesión</NextLink>
              <NextLink href="/register">
                <Box as="span" bg="brand.default" color="white" px={4} py={2} borderRadius="md">
                  Registrarse
                </Box>
              </NextLink>
            </>
          )}
        </Flex>

      </Flex>
    </Box>
  )
}