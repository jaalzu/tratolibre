"use client";

import { useState } from "react";
import { Input, Box, chakra } from "@chakra-ui/react";
import { inputStyles } from "./FormField";
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
      <chakra.button
        type="button"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={show}
        position="absolute"
        right="12px"
        top="50%"
        transform="translateY(-50%)"
        fontSize="xs"
        color="neutral.400"
        cursor="pointer"
        userSelect="none"
        bg="transparent"
        border="none"
        p="0"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Ocultar" : "Ver"}
      </chakra.button>
    </Box>
  );
};
