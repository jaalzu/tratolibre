"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import NextLink from "next/link";
import Image from "next/image";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useLogin, useGoogleLogin } from "@/features/auth/hooks";

import { FormField } from "./FormField";

const STORAGE_KEY = "tratolibre_remember";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isPending, error, clearError } = useLogin();
  const { handleGoogleLogin, isPending: isGooglePending } = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

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
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    await login(data);
  };

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full" py={4}>
      <Flex justify="center" mb={6}>
        <NextLink href="/">
          <Image
            src="/koala/logotext.webp"
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

      {/* Botón de Google  */}
      <Button
        variant="blue"
        width="full"
        borderRadius="full"
        py={1.5}
        mt={4}
        onClick={handleGoogleLogin}
        loading={isGooglePending}
        disabled={isPending}
      >
        <Flex align="center" gap={2}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          <Text>Continuar con Google</Text>
        </Flex>
      </Button>

      <Flex align="center" my={4} gap={2}>
        <Box flex="1" h="1px" bg="neutral.200" />
        <Text fontSize="xs" color="neutral.400">
          o
        </Text>
        <Box flex="1" h="1px" bg="neutral.200" />
      </Flex>

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
            disabled={isGooglePending}
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
