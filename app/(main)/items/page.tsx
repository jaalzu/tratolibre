import { createClient } from '@/lib/supabase/server'
import NextLink from 'next/link'
import { deleteItemAction } from '@/features/items/actions'
import { Box, Flex, Heading, Text, Stack, Image } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card' // Tu componente

export default async function MyItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: Items } = await supabase
    .from('items')
    .select('*')
    .eq('owner_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <PageContainer maxW="1280px" py="12">
      <Flex alignItems="center" justifyContent="space-between" mb="8">
        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900">
          Mis objetos
        </Heading>
        <Button asChild size="md">
          <NextLink href="/Item/new">+ Publicar objeto</NextLink>
        </Button>
      </Flex>

      {Items?.length === 0 && (
        <Flex flexDirection="column" alignItems="center" justifyContent="center" py="24" textAlign="center">
          <Text fontSize="3xl" mb="4">📦</Text>
          <Text fontWeight="bold" color="neutral.400" fontSize="lg">No publicaste nada todavía</Text>
          <Box asChild mt="2">
            <NextLink href="/item/new" style={{ color: 'var(--colors-brand-default)', fontWeight: 600 }}>
              Publicá tu primer objeto
            </NextLink>
          </Box>
        </Flex>
      )}

      <Stack gap="4">
        {Items?.map((obj) => (
          <Card 
            key={obj.id} 
            flexDirection="row" // Pisamos el column que tenés por defecto
            alignItems="center" 
            p="4" 
            gap="4"
          >
            {obj.images?.[0] && (
              <Image 
                src={obj.images[0]} 
                w="20" 
                h="20" 
                objectFit="cover" 
                borderRadius="md" 
                alt={obj.title}
                flexShrink="0"
              />
            )}
            
            <Box flex="1" minW="0">
              <Text fontWeight="bold" color="neutral.900" fontSize="md" truncate>
                {obj.title}
              </Text>
              <Text fontSize="sm" color="neutral.400" mb="1">
                {obj.city}
              </Text>
              <Text fontSize="md" color="brand.default" fontWeight="bold">
                ${obj.sale_price?.toLocaleString('es-AR')}
              </Text>
            </Box>

            <Flex gap="3">
              <Button asChild variant="secondary" size="sm">
                <NextLink href={`/item/${obj.id}`}>Ver</NextLink>
              </Button>
              
              <form action={async () => { 'use server'; await deleteItemAction(obj.id) }}>
                <Button 
                  type="submit" 
                  size="sm"
                  variant="ghost"
                  color="feedback.error"
                  borderWidth="1px"
                  borderColor="neutral.100"
                  _hover={{ bg: 'feedback.error', color: 'white', borderColor: 'feedback.error' }}
                >
                  Eliminar
                </Button>
              </form>
            </Flex>
          </Card>
        ))}
      </Stack>
    </PageContainer>
  )
}