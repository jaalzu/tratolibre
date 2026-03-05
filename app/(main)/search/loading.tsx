import { Box, Flex } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'

function SkeletonCard() {
  return (
    <Box w="186px">
      <Box w="186px" h="225px" borderRadius="6px" bg="neutral.100" className="skeleton" />
      <Box pt={2}>
        <Flex justify="space-between" align="center" mb={1}>
          <Box h="18px" w="80px" borderRadius="md" bg="neutral.100" className="skeleton" />
          <Box h="18px" w="24px" borderRadius="md" bg="neutral.100" className="skeleton" />
        </Flex>
        <Box h="16px" w="140px" borderRadius="md" bg="neutral.100" className="skeleton" />
      </Box>
    </Box>
  )
}

export default function SearchLoading() {
  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 24 }}>
      <Box h="28px" w="200px" borderRadius="md" bg="neutral.100" mb={6} className="skeleton" />
      <Flex wrap="wrap" gap={6}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Flex>
    </PageContainer>
  )
}