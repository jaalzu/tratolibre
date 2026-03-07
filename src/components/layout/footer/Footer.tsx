import { Box, Flex, Text, SimpleGrid } from '@chakra-ui/react'
import NextLink from 'next/link'

export const Footer = () => (
  <Box bg="white" px={{ base: 6, md: 16 }} pb={{ base: '80px', md: 10 }} pt={10}>
    <Box maxW="1280px" mx="auto">
      <Box borderTop="1px solid" borderColor="neutral.100" pt={8}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={3}>
              TratoLibre
            </Text>
            <Text fontSize="sm" color="neutral.400" lineHeight="tall">
              Cada objeto que no usás tiene valor para alguien más. 
              Conectamos personas para darle una segunda vida a las cosas — 
              más simple, más justo, sin intermediarios.
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" color="neutral.900" mb={3}>Explorá</Text>
            <Flex direction="column" gap={2}>
              <NextLink href="/item/new"><Text fontSize="sm" color="neutral.400">Publicar gratis</Text></NextLink>
            </Flex>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" color="neutral.900" mb={3}>Legal</Text>
            <Flex direction="column" gap={2}>
              <NextLink href="/about"><Text fontSize="sm" color="neutral.400">Quiénes somos</Text></NextLink>
              <NextLink href="/terms"><Text fontSize="sm" color="neutral.400">Términos y condiciones</Text></NextLink>
              <NextLink href="/privacy"><Text fontSize="sm" color="neutral.400">Política de privacidad</Text></NextLink>
            </Flex>
          </Box>
        </SimpleGrid>

        <Text fontSize="xs" color="neutral.300" textAlign="center" mt={8}>
          © {new Date().getFullYear()} TratoLibre. Todos los derechos reservados.
        </Text>
      </Box>
    </Box>
  </Box>
)