"use client";

import { Box, Text } from "@chakra-ui/react";

interface PriceInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function PriceInput({
  label,
  value,
  onChange,
  placeholder,
}: PriceInputProps) {
  return (
    <Box flex={1}>
      <Text fontSize="xs" color="neutral.500" mb={1}>
        {label}
      </Text>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={0}
        style={{
          width: "100%",
          height: "38px",
          padding: "0 10px",
          borderRadius: "8px",
          border: "1px solid var(--chakra-colors-neutral-200)",
          fontSize: "13px",
          outline: "none",
          backgroundColor: "transparent",
        }}
      />
    </Box>
  );
}
