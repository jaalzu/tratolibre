"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import NextLink from "next/link";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { SocialButtons } from "@/features/auth/components/SocialButtons";
import { FormField } from "./FormField";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isPending, error, clearError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginInput) => {
    await login(data);
  };

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full" py={4}>
      <Text fontSize="xl" fontWeight="bold" color="neutral.900">
        Bienvenido
      </Text>
      <Text fontSize="xs" color="neutral.400" mt={-1} mb={5}>
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
            onChange={clearError}
          />

          <FormField
            label="Contraseña"
            name="password"
            register={register}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Tu contraseña"
            onChange={clearError}
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

          {error && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            width="full"
            borderRadius="full"
            py={1.5}
            mt={2}
            loading={isPending}
            data-testid="submit-button"
          >
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Flex align="center" gap={3} my={3}>
        <Box flex={1} h="1px" bg="neutral.200" />
        <Text fontSize="xs" color="neutral.400">
          o continuá con
        </Text>
        <Box flex={1} h="1px" bg="neutral.200" />
      </Flex>

      <SocialButtons mode="login" />

      <Box textAlign="center" mt="5">
        <Text as="span" fontSize="sm" color="neutral.700">
          ¿No tenés cuenta?{" "}
        </Text>
        <NextLink href="/register" passHref>
          <Text
            as="span"
            fontSize="sm"
            color="accent.default"
            fontWeight="600"
            _hover={{ textDecoration: "underline" }}
            cursor="pointer"
          >
            Registrate
          </Text>
        </NextLink>
      </Box>
    </Flex>
  );
};
