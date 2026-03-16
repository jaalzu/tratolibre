import { Flex, Text, Box } from "@chakra-ui/react";
import { logoutAction } from "@/features/auth/actions";

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
  <Flex gap={6} align="center" mb={3}>
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
      <Box display={{ base: "block", md: "none" }} ml="auto">
        <form action={logoutAction}>
          <button type="submit">
            <i
              className="bx bx-log-out"
              style={{
                fontSize: "28px",
                color: "var(--chakra-colors-feedback-error)",
              }}
            />
          </button>
        </form>
      </Box>
    )}
  </Flex>
);
