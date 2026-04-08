// features/reports/components/ReportReasonOption.tsx

import { Flex, Box, Text } from "@chakra-ui/react";
import { ReportReasonOption as ReportReasonType } from "../types";

interface ReportReasonOptionProps {
  option: ReportReasonType;
  selected: boolean;
  onSelect: () => void;
}

export function ReportReasonOption({
  option,
  selected,
  onSelect,
}: ReportReasonOptionProps) {
  return (
    <Flex
      align="center"
      gap={3}
      p={3}
      borderRadius="xl"
      border="1px solid"
      borderColor={selected ? "brand.default" : "border.subtle"}
      bg={selected ? "brand.subtle" : "transparent"}
      cursor="pointer"
      onClick={onSelect}
      transition="all 0.15s"
    >
      <Box
        w={4}
        h={4}
        borderRadius="full"
        border="2px solid"
        borderColor={selected ? "brand.default" : "border"}
        bg={selected ? "brand.default" : "transparent"}
        flexShrink={0}
      />
      <Text fontSize="sm" color="fg">
        {option.label}
      </Text>
    </Flex>
  );
}
