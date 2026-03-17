import { Box, Flex } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SearchFilterBar } from "@/features/search/components/SearchFilterBar";

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

function ItemCardSkeleton() {
  return (
    <Box w="full">
      <Bone h="240px" borderRadius="5px" />
      <Box pt={2}>
        <Flex justify="space-between" align="center" mb={1}>
          <Bone w="80px" h="18px" />
          <Bone w="24px" h="24px" borderRadius="full" />
        </Flex>
        <Bone w="75%" h="16px" />
      </Box>
    </Box>
  );
}

export default function SearchLoading() {
  return (
    <>
      <SearchFilterBar />
      <PageContainer pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 8 }}>
        <Flex gap={8} align="flex-start">
          {/* FilterPanel placeholder — solo desktop */}
          <Box display={{ base: "none", md: "block" }} w="240px" flexShrink={0}>
            <Bone h="400px" borderRadius="xl" />
          </Box>

          {/* Results */}
          <Box flex={1}>
            <Bone w="200px" h="24px" borderRadius="md" />
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={{ base: 3, md: 5 }}
              mt={4}
            >
              {[...Array(8)].map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </Box>
          </Box>
        </Flex>
      </PageContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
