"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import NextLink from "next/link";
import Image from "next/image";
import { Flex, Text, Stack, Box } from "@chakra-ui/react";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/checkbox";

import { FormField } from "./FormField";
import { toaster } from "@/shared/components/ui/toaster";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "tratolibre_remember";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register: registerUser,
    isPending,
    error,
    success,
    reset,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (success) {
      // Mostrar mensaje de bienvenida
      setTimeout(() => {
        toaster.create({
          title: "¡Bienvenido a TratoLibre!",
          description: "Tu cuenta fue creada exitosamente. Redirigiendo...",
          type: "success",
          duration: 3000,
        });
      }, 0);

      // Redirigir al home después de 1.5 segundos
      setTimeout(() => {
        router.push("/");
      }, 1500);

      resetForm();
    }
  }, [success, resetForm, router]);

  const onSubmit = async (data: RegisterInput) => {
    // Guardar credenciales si el usuario quiere recordarlas
    if (rememberMe) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      );
    }

    await registerUser(data);
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
        Registro
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="2">
          <Flex gap={3} direction={{ base: "column", md: "row" }}>
            <FormField
              label="Nombre"
              name="firstName"
              register={register}
              error={errors.firstName}
              placeholder="Juan"
              required
              onChange={reset}
            />
            <FormField
              label="Apellido"
              name="lastName"
              register={register}
              error={errors.lastName}
              placeholder="García"
              required
              onChange={reset}
            />
          </Flex>

          <FormField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            placeholder="tucorreo@gmail.com"
            required
            onChange={reset}
          />

          <FormField
            label="Contraseña"
            name="password"
            register={register}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            onChange={reset}
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

          <Flex pt={2}>
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(e) => setRememberMe(e.checked === true)}
            >
              Recordar mis datos
            </Checkbox>
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
            Crear cuenta
          </Button>
        </Stack>
      </form>
      <Text fontSize="xs" color="neutral.400" textAlign="center" mt="5">
        ¿Ya tenés cuenta?{" "}
        <Text as="span" color="accent.default" fontWeight="600">
          <NextLink href="/login">
            <Text
              as="span"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
            >
              Iniciá sesión
            </Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  );
};
