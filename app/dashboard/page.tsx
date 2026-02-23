import { createClient } from '@/lib/supabase/server'
import NextLink from 'next/link'
import { Box, Flex, Heading, Text, SimpleGrid, Circle } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Conteo de objetos (solo compra/venta)
  const { count: objectsCount } = await supabase
    .from('objects')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user?.id)

  return (
    <PageContainer maxW="3xl" py="12">
      {/* Header de Bienvenida */}
      <Flex alignItems="center" gap="4" mb="10">
        <Circle 
          size="12" 
          bg="brand.default" 
          color="white" 
          fontWeight="bold" 
          fontSize="xl"
        >
          {profile?.name?.[0]?.toUpperCase()}
        </Circle>
        <Box>
          <Heading as="h1" fontSize="xl" fontWeight="bold" color="neutral.900">
            Hola, {profile?.name} 👋
          </Heading>
          <Text fontSize="sm" color="neutral.400">
            Bienvenido a TratoLibre
          </Text>
        </Box>
      </Flex>

      {/* Grid de Acciones Principales */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
        
        {/* Mis Objetos */}
        <Card 
          asChild 
          transition="all 0.2s"
          _hover={{ shadow: 'base', borderColor: 'brand.default' }}
        >
          <NextLink href="/dashboard/objects">
            <Text fontSize="3xl" fontWeight="bold" color="brand.default">
              {objectsCount ?? 0}
            </Text>
            <Text fontSize="sm" color="neutral.700" fontWeight="bold" mt="1">
              Objetos publicados
            </Text>
            <Text fontSize="xs" color="brand.default" mt="3" fontWeight="bold">
              Ver mis objetos →
            </Text>
          </NextLink>
        </Card>

        {/* Publicar Nuevo */}
        <Card 
          asChild
          borderStyle="dashed" 
          borderColor="neutral.200" 
          bg="transparent"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          transition="all 0.2s"
          _hover={{ borderColor: 'brand.default', bg: 'neutral.50' }}
        >
          <NextLink href="/object/new">
            <Text fontSize="3xl" mb="2">📦</Text>
            <Text fontSize="sm" fontWeight="bold" color="neutral.700">
              Publicar nuevo objeto
            </Text>
            <Text fontSize="xs" color="neutral.400" mt="1">
              Poné algo a la venta hoy
            </Text>
          </NextLink>
        </Card>

      </SimpleGrid>
    </PageContainer>
  )
}