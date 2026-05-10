"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import NextLink from "next/link";
import Image from "next/image";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/checkbox";

import { FormField } from "./FormField";

const STORAGE_KEY = "tratolibre_remember";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isPending, error, clearError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Cargar credenciales guardadas al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { email, password } = JSON.parse(saved);
        setValue("email", email);
        setValue("password", password);
        setRememberMe(true);
      }
    } catch (err) {
      // Si hay error, limpiar localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    // Guardar o limpiar credenciales según el checkbox
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    await login(data);
  };

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full" py={4}>
      {/* Logo */}
      <Flex justify="center" mb={6}>
        <NextLink href="/">
          <Image
            src="/koala/logotext2.png"
            alt="TratoLibre Logo"
            width={180}
            height={45}
            priority
            style={{ width: "auto", height: "45px" }}
          />
        </NextLink>
      </Flex>

      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={1}>
        Iniciar sesión
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
            required
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

          {/* Recordarme */}
          <Flex justify="space-between" align="center" pt={1}>
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(e) => setRememberMe(e.checked === true)}
            >
              Recordarme
            </Checkbox>

            <NextLink href="/forgot-password">
              <Text
                fontSize="sm"
                color="accent.default"
                fontWeight="600"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </NextLink>
          </Flex>

          {error && (
            <Box py={2}>
              <Text fontSize="xs" color="feedback.error" textAlign="center">
                {error}
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            width="full"
            borderRadius="full"
            py={1.5}
            mt={3}
            loading={isPending}
            data-testid="submit-button"
          >
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Text fontSize="xs" color="neutral.400" textAlign="center" mt="5">
        ¿No tenés cuenta?{" "}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/register">
            <Text
              as="span"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
            >
              Registrate gratis
            </Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  );
};
