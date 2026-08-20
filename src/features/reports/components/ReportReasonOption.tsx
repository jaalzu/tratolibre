// features/reports/components/ReportReasonOption.tsx

import { chakra, Box, Text } from "@chakra-ui/react";
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const group = e.currentTarget.closest('[role="radiogroup"]');
      const radios = Array.from(
        group?.querySelectorAll<HTMLElement>('[role="radio"]') ?? [],
      );
      const idx = radios.indexOf(e.currentTarget);
      const next = radios[idx + dir];
      next?.focus();
    }
  };

  return (
    <chakra.button
      type="button"
      role="radio"
      aria-checked={selected}
      onKeyDown={handleKeyDown}
      onClick={onSelect}
      alignItems="center"
      gap={3}
      p={3}
      borderRadius="xl"
      border="1px solid"
      borderColor={selected ? "brand.default" : "border.subtle"}
      bg={selected ? "brand.subtle" : "transparent"}
      cursor="pointer"
      transition="all 0.15s"
      w="full"
      textAlign="left"
      display="flex"
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
    </chakra.button>
  );
}
