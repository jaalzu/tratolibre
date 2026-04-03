"use client";

import { Flex, Input, Box } from "@chakra-ui/react";
import { memo } from "react";
import { Send } from "@boxicons/react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  sending: boolean;
}

export const ChatInput = memo(
  ({ value, onChange, onSend, sending }: ChatInputProps) => (
    <Flex
      p="4"
      gap="2"
      borderTop="1px solid"
      borderColor="neutral.100"
      align="center"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        data-testid="chat-input"
        placeholder="Escribí un mensaje..."
        fontSize="md"
        borderColor="neutral.200"
        borderRadius="full"
        pl="5"
        _focus={{ borderColor: "brand.default", boxShadow: "none" }}
      />
      <Box
        as="button"
        onClick={onSend}
        data-testid="send-button"
        w="10"
        h="10"
        borderRadius="full"
        bg={value.trim() && !sending ? "brand.default" : "neutral.200"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor={value.trim() && !sending ? "pointer" : "not-allowed"}
        transition="all 0.2s"
        flexShrink={0}
      >
        <Send width="18px" height="18px" fill="white" />
      </Box>
    </Flex>
  ),
);
