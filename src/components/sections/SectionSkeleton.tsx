import { Box, Flex } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";

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

export function SectionSkeleton() {
  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={4}>
      <Box bg="neutral.50" borderRadius="2xl" p={4}>
        {/* Título */}
        <Bone w="200px" h="20px" borderRadius="md" />
        <Box borderTop="1px solid" borderColor="neutral.100" my={4} mx={-4} />
        {/* Cards */}
        <Flex gap={3} overflow="hidden">
          {[...Array(5)].map((_, i) => (
            <Box key={i} flexShrink={0} w="190px">
              <Bone h="200px" borderRadius="xl" />
              <Box mt={2}>
                <Bone w="80%" h="14px" />
              </Box>
              <Box mt={1.5}>
                <Bone w="50%" h="14px" />
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </PageContainer>
  );
}
