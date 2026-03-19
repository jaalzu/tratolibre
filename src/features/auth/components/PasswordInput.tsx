"use client";

import { useState } from "react";
import { Input, Box, Text } from "@chakra-ui/react";
import { inputStyles } from "./auth.utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  registration: UseFormRegisterReturn;
  placeholder?: string;
}

export const PasswordInput = ({
  registration,
  placeholder = "Tu contraseña",
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <Box position="relative" w="full">
      <Input
        {...registration}
        w="full"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...inputStyles}
        pr="40px"
      />
      <Text
        position="absolute"
        right="12px"
        top="50%"
        transform="translateY(-50%)"
        fontSize="xs"
        color="neutral.400"
        cursor="pointer"
        userSelect="none"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Ocultar" : "Ver"}
      </Text>
    </Box>
  );
};
