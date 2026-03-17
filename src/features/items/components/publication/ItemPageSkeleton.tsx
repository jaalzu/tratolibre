import { Box, Flex, Separator } from "@chakra-ui/react";

function Bone({
  w = "100%",
  h = "16px",
  borderRadius = "md",
}: {
  w?: string;
  h?: string;
  borderRadius?: string;
}) {
  return (
    <Box
      w={w}
      h={h}
      bg="neutral.100"
      borderRadius={borderRadius}
      style={{ animation: "pulse 1.5s ease-in-out infinite" }}
    />
  );
}

export function ItemPageSkeleton() {
  return (
    <Box pb={{ base: "0px", md: 0 }}>
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}>
        {/* Imagen principal */}
        <Box pt={3} px={0}>
          <Bone h="75vw" borderRadius="xl" />
          {/* Thumbnails */}
          <Flex gap={2} mt={3} px={4}>
            {[...Array(4)].map((_, i) => (
              <Bone key={i} w="56px" h="56px" borderRadius="md" />
            ))}
          </Flex>
        </Box>

        <Box px={4} pt={4}>
          {/* ItemInfo */}
          <Bone w="80%" h="24px" />
          <Box mt={2}>
            <Bone w="50%" h="16px" />
          </Box>
          <Box mt={3}>
            <Bone w="40%" h="28px" />
          </Box>

          {/* SellerCard */}
          <Box mt={4}>
            <Flex
              align="center"
              justify="space-between"
              border="1px solid"
              borderColor="neutral.100"
              bg="neutral.150"
              borderRadius="xl"
              px={5}
              py={5}
            >
              <Flex align="center" gap={3}>
                <Bone w="48px" h="48px" borderRadius="full" />
                <Box>
                  <Bone w="100px" h="14px" />
                  <Box mt={1.5}>
                    <Bone w="80px" h="12px" />
                  </Box>
                </Box>
              </Flex>
              <Bone w="64px" h="36px" borderRadius="lg" />
            </Flex>
          </Box>

          {/* Categoría */}
          <Box mt={4}>
            <Bone w="100px" h="28px" borderRadius="full" />
          </Box>

          <Separator my={5} borderColor="neutral.100" />

          {/* Descripción */}
          <Bone w="60%" h="20px" />
          <Box mt={3}>
            <Bone h="14px" />
          </Box>
          <Box mt={2}>
            <Bone h="14px" w="90%" />
          </Box>
          <Box mt={2}>
            <Bone h="14px" w="75%" />
          </Box>

          <Separator my={6} borderColor="neutral.100" />
        </Box>

        {/* Botón fijo bottom */}
        <Box
          position="fixed"
          bottom="60px"
          left={0}
          right={0}
          px={4}
          py={3}
          bg="neutral.150"
          borderTop="1px solid"
          borderColor="neutral.300"
          zIndex={40}
        >
          <Bone h="44px" borderRadius="xl" />
        </Box>
      </Box>

      {/* Desktop */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={10}>
          <Flex gap={10} align="start">
            {/* Columna izquierda */}
            <Box flex="1" minW={0}>
              <Bone h="400px" borderRadius="xl" />
              <Flex gap={2} mt={3}>
                {[...Array(4)].map((_, i) => (
                  <Bone key={i} w="56px" h="56px" borderRadius="md" />
                ))}
              </Flex>
              <Box mt={4}>
                <Bone w="100px" h="28px" borderRadius="full" />
              </Box>
              <Separator my={6} borderColor="neutral.100" />
              <Bone w="60%" h="20px" />
              <Box mt={3}>
                <Bone h="14px" />
              </Box>
              <Box mt={2}>
                <Bone h="14px" w="90%" />
              </Box>
              <Box mt={2}>
                <Bone h="14px" w="75%" />
              </Box>
              <Separator my={8} borderColor="neutral.100" />
            </Box>

            {/* Columna derecha */}
            <Box w="300px" flexShrink={0}>
              <Box
                border="1px solid"
                borderColor="neutral.900"
                borderRadius="xl"
                bg="neutral.150"
                px={4}
                py={6}
                mb={3}
              >
                <Bone w="80%" h="24px" />
                <Box mt={2}>
                  <Bone w="50%" h="16px" />
                </Box>
                <Box mt={3}>
                  <Bone w="40%" h="28px" />
                </Box>
                <Box mt={5}>
                  <Bone h="44px" borderRadius="xl" />
                </Box>
              </Box>

              {/* SellerCard */}
              <Flex
                align="center"
                justify="space-between"
                border="1px solid"
                borderColor="neutral.900"
                bg="neutral.150"
                borderRadius="xl"
                px={5}
                py={5}
              >
                <Flex align="center" gap={3}>
                  <Bone w="48px" h="48px" borderRadius="full" />
                  <Box>
                    <Bone w="100px" h="14px" />
                    <Box mt={1.5}>
                      <Bone w="80px" h="12px" />
                    </Box>
                  </Box>
                </Flex>
                <Bone w="64px" h="36px" borderRadius="lg" />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
}
