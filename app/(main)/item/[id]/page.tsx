import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Separator , Text } from '@chakra-ui/react'
import ItemImageSlider from '@/components/items/ItemImageSlider'
import ItemInfo from '@/components/items/ItemInfo'
import ItemDetails from '@/components/items/ItemDetails'
import SellerCard from '@/components/items/SellerCard'
import RelatedItems from '@/components/items/RelatedItems'
import ItemActions from '@/components/items/ItemActions'
import { Suspense } from 'react'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItemById(id)
  if (!item) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  
  return (
    <Box pb={{ base: "140px", md: 0 }}>
      {/* ── MOBILE ── */}
      <Box display={{ base: "block", md: "none" }}>
        <Box pt={3}>
          <ItemImageSlider images={item.images} title={item.title} />
        </Box>

        <Box px={4} pt={2}>
          <ItemInfo item={item} />

          <Box mt={4}>
            <SellerCard profile={item.profiles} itemId={item.id} />
          </Box>

            {item.category && (
  <Box display="inline-block" mt={4} px={5} py={1} bg="neutral.100" borderRadius="full">
    <Text fontSize="md" color="neutral.900" textTransform="capitalize">{item.category}</Text>
  </Box>
)}

          <Separator my={5} borderColor="neutral.100" />

          <ItemDetails item={item} />

          <Separator my={6} borderColor="neutral.100" />

         <Suspense fallback={<Box h="200px" />}>
  <RelatedItems category={item.category} excludeId={id} />
</Suspense>
        </Box>

        {/* Botones fijos encima del BottomNav */}
        <Box
          position="fixed"
          bottom="60px"
          left={0}
          right={0}
          px={4}
          py={3}
          bg="white"
          borderTop="1px solid"
          borderColor="neutral.100"
          zIndex={40}
        >
          <ItemActions item={item} userId={user?.id ?? null} />
        </Box>
      </Box>

      {/* ── DESKTOP ── */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={10}>
          <Flex gap={10} align="start">

            {/* Izquierda — imagen + detalles */}
            <Box flex="1" minW={0}>
              <ItemImageSlider images={item.images} title={item.title} />

              {item.category && (
   <Box display="inline-block" mt={4} mx={3} px={5} py={1} bg="neutral.100" borderRadius="full">
    <Text fontSize="md" color="neutral.900" textTransform="capitalize">{item.category}</Text>
  </Box>
)}

              <Separator my={6} borderColor="neutral.100" />

              <ItemDetails item={item} />

              <Separator my={8} borderColor="neutral.100" />

              <Suspense fallback={<Box h="200px" />}>
  <RelatedItems category={item.category} excludeId={id} />
</Suspense>
            </Box>

            {/* Derecha — info + acciones + perfil */}
            <Box w="300px" flexShrink={0}>
              <Box position="sticky" top="24px">

                {/* Contenedor info + botones */}
                <Box
                  border="1px solid"
                  borderColor="neutral.100"
                  borderRadius="xl"
                  bg="neutral.50"
                  px={4}
                  py={6}
                  mb={3}
                >
                  <ItemInfo item={item} />
                  <Box mt={5}>
                    <ItemActions item={item} userId={user?.id ?? null} />
                  </Box>
                </Box>

                {/* Perfil debajo */}
                <SellerCard profile={item.profiles} itemId={item.id} />
              </Box>
            </Box>

          </Flex>
        </Box>
      </Box>

    </Box>
  )
}