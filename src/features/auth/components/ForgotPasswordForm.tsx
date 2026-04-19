// features/auth/components/ForgotPasswordForm.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas";
import { useForgotPassword } from "@/features/auth/hooks";
import NextLink from "next/link";
import { Flex, Text, Input, Field, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";

export const ForgotPasswordForm = () => {
  // ✅ Hook custom
  const { sendResetEmail, isPending, error, success, reset } =
    useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    await sendResetEmail(data);
  };

  const inputStyles = {
    borderColor: "neutral.500",
    borderRadius: "lg",
    h: "44px",
    px: "3",
    _focus: { borderColor: "brand.default", boxShadow: "none" },
    _placeholder: { color: "neutral.400" },
  };

  // ✅ Mostrar mensaje de éxito
  if (success) {
    return (
      <Flex direction="column" maxW="360px" mx="auto" w="full" gap={2}>
        <Text fontSize="xl" fontWeight="bold" color="neutral.900">
          Revisá tu email
        </Text>
        <Text fontSize="xs" color="neutral.500">
          Te enviamos un enlace para restablecer tu contraseña. Revisá tu
          bandeja de entrada y spam.
        </Text>
        <Text fontSize="xs" color="neutral.400" textAlign="center" mt={4}>
          <Text as="span" color="accent.default" fontWeight="600">
            <NextLink href="/login">
              <Text as="span" _hover={{ textDecoration: "underline" }}>
                Volver al inicio de sesión
              </Text>
            </NextLink>
          </Text>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" maxW="360px" py={6} mx="auto" w="full">
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>
        ¿Olvidaste tu contraseña?
      </Text>
      <Text fontSize="xs" color="neutral.400" mb={4}>
        Ingresá tu email y te enviamos un enlace para restablecerla.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
              Email
            </Field.Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="tucorreo@gmail.com"
              onChange={reset}
              {...inputStyles}
            />
            {errors.email && (
              <Field.ErrorText fontSize="xs">
                {errors.email.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          {/* ✅ Error del hook */}
          {error && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">
              {error}
            </Text>
          )}

          {/* ✅ Loading del hook */}
          <Button
            type="submit"
            width="full"
            mt={2}
            borderRadius="full"
            py={1.5}
            loading={isPending}
          >
            Enviar enlace
          </Button>
        </Stack>
      </form>

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt={5}>
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login">
            <Text as="span" _hover={{ textDecoration: "underline" }}>
              Volver al inicio de sesión
            </Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  );
};
