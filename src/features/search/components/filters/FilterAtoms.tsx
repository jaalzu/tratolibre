import { Text, Box } from "@chakra-ui/react";

export const SectionTitle = ({ children }: { children: string }) => (
  <Text
    fontSize="xs"
    fontWeight="bold"
    color="neutral.500"
    mb={2}
    letterSpacing="wider"
  >
    {children}
  </Text>
);

export const OptionButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Box
    as="button"
    onClick={onClick}
    px={3}
    py={2}
    borderRadius="lg"
    textAlign="left"
    w="full"
    transition="all 0.15s"
    bg={active ? "brand.50" : "transparent"}
    border="1px solid"
    borderColor={active ? "brand.default" : "neutral.200"}
  >
    <Text
      fontSize="sm"
      color={active ? "brand.default" : "neutral.700"}
      fontWeight={active ? "bold" : "normal"}
    >
      {label}
    </Text>
  </Box>
);
