import { Box, Flex, Separator } from "@chakra-ui/react";

function Bone({ w = "100%", h = "16px", borderRadius = "md" }: { w?: string; h?: string; borderRadius?: string }) {
  return <Box w={w} h={h} bg="neutral.100" borderRadius={borderRadius} style={{ animation: "pulse 1.5s ease-in-out infinite" }} />;
}

export function ItemPageSkeleton() {
  return (
    <Box pb={{ base: "0px", md: 0 }}>
      {/* ========== MOBILE ========== matches ItemPageContent.tsx:37 */}
      <Box display={{ base: "block", md: "none" }}>
        <Box pt={0}>
          {/* ItemImageSlider.tsx:33 aspect 1/1 maxH 400 -> borderBottomRadius xl only */}
          <Box w="100%" h="75vw" bg="neutral.100" borderBottomRadius="xl" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
        </Box>
        <Box px={4} pt={2}>
          {/* ItemInfo.tsx:16 title */}
          <Bone w="90%" h="26px" />
          {/* ItemInfo.tsx:22 condition subtitle */}
          <Box mt={3}><Bone w="50%" h="16px" /></Box>
          {/* ItemInfo.tsx:41 price $16.000 */}
          <Box mt={4}><Bone w="120px" h="28px" /></Box>
          {/* SellerCard.tsx:54 */}
          <Box mt={4}>
            <Flex align="center" justify="space-between" gap={3} border="1px solid" borderColor="border.subtle" bg="bg.card" boxShadow="base" borderRadius="lg" px={5} py={5}>
              <Flex align="center" gap={3}>
                {/* avatar 48 */}
                <Bone w="48px" h="48px" borderRadius="full" />
                {/* name + stars */}
                <Box><Bone w="100px" h="14px" /><Flex mt={1.5} gap="2px" align="center"><Flex gap="1px">{[...Array(5)].map((_, i) => <Box key={i} w="12px" h="12px" bg="neutral.100" borderRadius="sm" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />)}</Flex><Bone w="30px" h="10px" /></Flex></Box>
              </Flex>
              {/* SellerCard chat button */}
              <Bone w="64px" h="36px" borderRadius="lg" />
            </Flex>
          </Box>
          {/* ItemPageContent.tsx:56 category pill */}
          <Box display="inline-block" mt={4} px={5} py={1}><Bone w="100px" h="20px" borderRadius="full" /></Box>
          <Separator my={5} borderColor="neutral.100" />
          {/* ItemDetails.tsx:12 Detalles del producto */}
          <Bone w="60%" h="20px" />
          <Box mt={3}><Bone h="14px" /></Box>
          <Box mt={2}><Bone h="14px" w="90%" /></Box>
          <Box mt={2}><Bone h="14px" w="75%" /></Box>
          {/* ItemDetails.tsx:22 Ubicación */}
          <Box mt={8}><Bone w="60px" h="16px" /></Box>
          <Separator my={6} borderColor="neutral.100" />
        </Box>
        {/* ItemActions.tsx:46 fixed bottom bar */}
        <Box position="fixed" bottom="56px" left={0} right={0} px={3} py={3} bg="bg.card" borderTop="1px solid" borderColor="border.subtle" zIndex={40}>
          <Bone h="44px" borderRadius="lg" />
        </Box>
      </Box>

      {/* ========== DESKTOP ========== matches ItemPageContent.tsx:96 */}
      <Box display={{ base: "none", md: "block" }}>
        {/* ItemPageContent.tsx:97 maxW 900 px10 py5 */}
        <Box maxW="900px" mx="auto" px={10} py={5}>
          {/* Breadcrumb.tsx */}
          <Box mb={3}><Bone w="200px" h="14px" /></Box>
          <Flex gap={10} align="start">
            {/* left col: image + category + details */}
            <Box flex="1" minW={0}>
              {/* ItemImageSlider.tsx:33 -> desktop 2px all corners */}
              <Box w="100%" h="400px" bg="neutral.100" borderRadius="2px" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
              {/* category pill mt4 mx3 */}
              <Box display="inline-block" mt={4} mx={3} px={5} py={1}><Bone w="100px" h="20px" borderRadius="full" /></Box>
              <Separator my={6} borderColor="neutral.100" />
              {/* ItemDetails */}
              <Bone w="60%" h="20px" />
              <Box mt={3}><Bone h="14px" /></Box>
              <Box mt={2}><Bone h="14px" w="90%" /></Box>
              <Box mt={2}><Bone h="14px" w="75%" /></Box>
              <Box mt={8}><Bone w="60px" h="16px" /></Box>
              <Separator my={8} borderColor="neutral.100" />
            </Box>
            {/* right col: w320 sticky */}
            <Box w="320px" flexShrink={0}>
              <Box position="sticky" top="24px">
                {/* ItemInfo + ItemActions card -> ItemPageContent.tsx:135 px5 py10 minH 300 */}
                <Box border="1px solid" boxShadow="base" borderColor="border.subtle" borderRadius="lg" bg="bg.card" px={5} py={10} mb={3} minH="300px">
                  {/* ItemInfo title */}
                  <Bone w="90%" h="26px" />
                  {/* ItemInfo condition */}
                  <Box mt={3}><Bone w="50%" h="16px" /></Box>
                  {/* ItemInfo price */}
                  <Box mt={4}><Bone w="120px" h="28px" /></Box>
                  {/* ItemActions owner: 2 buttons Editar/Eliminar */}
                  <Box mt="38px"><Flex gap={2}><Bone h="36px" borderRadius="md" /><Bone h="36px" borderRadius="md" /></Flex></Box>
                  {/* ItemActions Marcar como vendido */}
                  <Box mt={4} display="flex" justifyContent="center"><Bone w="160px" h="14px" /></Box>
                </Box>
                {/* SellerCard.tsx:54 -> right column second card */}
                <Flex align="center" justify="space-between" gap={3} border="1px solid" borderColor="border.subtle" bg="bg.card" boxShadow="base" borderRadius="lg" px={5} py={5}>
                  <Flex align="center" gap={3}>
                    <Bone w="48px" h="48px" borderRadius="full" />
                    <Box><Bone w="100px" h="14px" /><Flex mt={1.5} gap="2px" align="center"><Flex gap="1px">{[...Array(5)].map((_, i) => <Box key={i} w="12px" h="12px" bg="neutral.100" borderRadius="sm" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />)}</Flex><Bone w="30px" h="10px" /></Flex></Box>
                  </Flex>
                  <Bone w="64px" h="36px" borderRadius="lg" />
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <style>{`@keyframes pulse {0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </Box>
  );
}
