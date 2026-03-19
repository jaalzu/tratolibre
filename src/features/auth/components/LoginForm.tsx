"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/features/auth/schemas";
import NextLink from "next/link";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/features/auth/actions";
import { SocialButtons } from "@/features/auth/components/SocialButtons";
import { FormField } from "./FormField";

export const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await loginAction(data);
    if (result?.error) setServerError(result.error);
  };

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full" py={3}>
      <Text fontSize="xl" fontWeight="bold" color="neutral.900">
        Bienvenido
      </Text>
      <Text fontSize="xs" color="neutral.400" mb={4}>
        Iniciá sesión en TratoLibre
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <FormField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            placeholder="tucorreo@gmail.com"
          />

          <FormField
            label="Contraseña"
            name="password"
            register={register}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Tu contraseña"
            rightElement={
              <Text
                fontSize="xs"
                color="neutral.400"
                cursor="pointer"
                userSelect="none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </Text>
            }
          />

          <Text
            fontSize="xs"
            color="accent.default"
            textAlign="right"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            <NextLink href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </NextLink>
          </Text>

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">
              {serverError}
            </Text>
          )}

          <Button
            type="submit"
            width="full"
            borderRadius="full"
            py={1}
            loading={isSubmitting}
          >
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Flex align="center" gap={3} my={4}>
        <Box flex={1} h="1px" bg="neutral.200" />
        <Text fontSize="xs" color="neutral.400">
          o continuá con
        </Text>
        <Box flex={1} h="1px" bg="neutral.200" />
      </Flex>

      <SocialButtons />

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt="5">
        ¿No tenés cuenta?{" "}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/register">
            <Text as="span" _hover={{ textDecoration: "underline" }}>
              Registrate
            </Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  );
};
