import { Flex, Text, Box } from "@chakra-ui/react";
import { logoutAction } from "@/features/auth/actions";
import { ArrowOutLeftSquareHalf } from "@boxicons/react";

interface ProfileStatsProps {
  salesCount: number;
  purchasesCount: number;
  isOwner?: boolean;
}

export const ProfileStats = ({
  salesCount,
  purchasesCount,
  isOwner,
}: ProfileStatsProps) => (
  <Flex gap={6} align="center" mb={3} w="full">
    <Text fontSize="sm" color="neutral.700">
      <Text as="span" fontWeight="bold">
        {salesCount}
      </Text>{" "}
      Ventas
    </Text>
    <Text fontSize="sm" color="neutral.700">
      <Text as="span" fontWeight="bold">
        {purchasesCount}
      </Text>{" "}
      Compras
    </Text>

    {isOwner && (
      <Box ml="auto">
        <form action={logoutAction}>
          <button type="submit" style={{ display: "flex", cursor: "pointer" }}>
            <ArrowOutLeftSquareHalf
              width="28px"
              height="28px"
              fill="var(--chakra-colors-feedback-error)"
            />
          </button>
        </form>
      </Box>
    )}
  </Flex>
);
