import { Box, Flex, Skeleton } from '@chakra-ui/react'

export default function ItemLoading() {
  return (
    <Box pb={{ base: "140px", md: 0 }}>
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}>
        <Skeleton h="300px" w="100%" />
        <Box px={4} pt={4}>
          <Skeleton h="6" w="60%" mb={2} />
          <Skeleton h="8" w="40%" mb={4} />
          <Skeleton h="20" w="100%" mb={4} />
          <Skeleton h="24" w="100%" mb={4} />
          <Skeleton h="6" w="30%" mb={2} />
          <Skeleton h="6" w="50%" />
        </Box>
      </Box>

      {/* Desktop */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={10}>
          <Flex gap={10} align="start">
            <Box flex="1">
              <Skeleton h="400px" borderRadius="xl" mb={4} />
              <Flex gap={2}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} w="60px" h="60px" borderRadius="md" />
                ))}
              </Flex>
              <Skeleton h="4" w="100%" mt={6} mb={2} />
              <Skeleton h="4" w="80%" mb={2} />
              <Skeleton h="4" w="90%" />
            </Box>
            <Box w="300px" flexShrink={0}>
              <Skeleton h="300px" borderRadius="xl" />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}