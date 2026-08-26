import { Box, Flex, Skeleton } from "@chakra-ui/react";

export default function ItemLoading() {
  return (
    <Box pb={{ base: "140px", md: 0 }}>
      {/* Mobile -> borderBottomRadius xl only */}
      <Box display={{ base: "block", md: "none" }}>
        <Skeleton h="340px" w="100%" borderTopRadius="none" borderBottomRadius="xl" />
        <Box px={4} pt={4}>
          <Skeleton h="6" w="60%" mb={2} />
          <Skeleton h="8" w="40%" mb={4} />
          <Skeleton h="20" w="100%" mb={4} />
          <Skeleton h="24" w="100%" mb={4} />
          <Skeleton h="6" w="30%" mb={2} />
          <Skeleton h="6" w="50%" />
        </Box>
      </Box>

      {/* Desktop -> mirrors ItemPageContent.tsx:96 + ItemPageSkeleton.tsx */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={5}>
          {/* Breadcrumb.tsx */}
          <Skeleton h="14px" w="200px" mb={3} />
          <Flex gap={10} align="start">
            <Box flex="1" minW={0}>
              {/* ItemImageSlider.tsx:33 h400 -> 2px */}
              <Skeleton h="400px" borderRadius="2px" />
              {/* category pill */}
              {/* <Box mt={4} mx={3}>
                <Skeleton h="28px" w="100px" borderRadius="full" />
              </Box> */}
              {/* ItemDetails */}
              <Skeleton h="4" w="60%" mt={6} mb={2} />
              <Skeleton h="4" w="100%" mb={2} />
              <Skeleton h="4" w="80%" mb={2} />
              <Skeleton h="4" w="90%" />
            </Box>
            <Box w="320px" flexShrink={0}>
              {/* ItemInfo + ItemActions card -> ItemPageContent.tsx:135 px5 py10 minH300 */}
              <Box
                border="1px solid"
                borderColor="border.subtle"
                borderRadius="lg"
                bg="bg.card"
                px={5}
                py={10}
                mb={3}
                minH="320px"
              >
                {/* ItemInfo title 90% 26px */}
                <Skeleton h="26px" w="90%" mb={3} />
                {/* ItemInfo condition */}
                <Skeleton h="16px" w="50%" mb={4} />
                {/* ItemInfo price $16.000 */}
                <Skeleton h="28px" w="120px" mb={2} />
                {/* ItemActions 2 buttons mt38 */}
                <Flex gap={2} mt="48px">
                  <Skeleton h="36px" flex={1} borderRadius="md" />
                  <Skeleton h="36px" flex={1} borderRadius="md" />
                </Flex>
                {/* Marcar como vendido */}
                <Flex justify="center" mt={4}>
                  <Skeleton h="14px" w="160px" />
                </Flex>
              </Box>
              {/* SellerCard.tsx:54 */}
              <Flex
                align="center"
                justify="space-between"
                border="1px solid"
                borderColor="border.subtle"
                bg="bg.card"
                borderRadius="lg"
                px={5}
                py={5}
              >
                <Flex align="center" gap={3}>
                  <Skeleton w="48px" h="48px" borderRadius="full" />
                  <Box>
                    <Skeleton h="14px" w="100px" mb={1} />
                    <Flex gap="2px" align="center" mt={1}>
                      <Flex gap="1px">
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            w="12px"
                            h="12px"
                            bg="neutral.100"
                            borderRadius="sm"
                          />
                        ))}
                      </Flex>
                      <Skeleton h="10px" w="30px" ml={1} />
                    </Flex>
                  </Box>
                </Flex>
                <Skeleton w="64px" h="36px" borderRadius="lg" />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
