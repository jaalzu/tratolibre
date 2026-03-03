import { Box, Flex } from '@chakra-ui/react'

const ConversationSkeleton = () => (
  <Flex gap={3} align="center" px={4} py={3}>
    <Box w="48px" h="48px" borderRadius="xl" bg="neutral.100" flexShrink={0} />
    <Box flex="1">
      <Box w="70%" h="13px" bg="neutral.100" borderRadius="md" mb={1.5} />
      <Box w="50%" h="11px" bg="neutral.100" borderRadius="md" />
    </Box>
  </Flex>
)

export default function ChatLoading() {
  return (
    <>
      {/* Mobile */}
      <Box display={{ base: 'flex', md: 'none' }} flexDirection="column" h="calc(100dvh - 120px)">
        <Flex direction="column" gap={1} pt={2}>
          {[...Array(8)].map((_, i) => <ConversationSkeleton key={i} />)}
        </Flex>
      </Box>

      {/* Desktop */}
      <Box display={{ base: 'none', md: 'flex' }} h="calc(100dvh - 90px)">
        <Box w="300px" borderRight="1px solid" borderColor="neutral.100">
          <Flex direction="column" gap={1} pt={2}>
            {[...Array(8)].map((_, i) => <ConversationSkeleton key={i} />)}
          </Flex>
        </Box>
        <Flex flex="1" align="center" justify="center" color="neutral.400" fontSize="sm">
          Seleccioná una conversación
        </Flex>
      </Box>
    </>
  )
}