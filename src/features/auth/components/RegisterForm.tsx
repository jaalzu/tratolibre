// features/auth/components/RegisterForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import NextLink from "next/link";
import { Flex, Text, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { FormField } from "./FormField";
import { toaster } from "@/components/ui/toaster";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

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
      toaster.create({
        title: "¡Casi listo!",
        description: "Te enviamos un email. Confirmá tu cuenta para continuar.",
        type: "success",
        duration: 10000,
      });

      // Limpiar form
      resetForm();
    }
  }, [success, resetForm]);

  const onSubmit = async (data: RegisterInput) => {
    await registerUser(data);
  };

  return (
    <Flex direction="column" maxW="360px" mx="auto" w="full">
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
            <Text as="span" _hover={{ textDecoration: "underline" }}>
              Iniciá sesión
            </Text>
          </NextLink>
        </Text>
      </Text>
    </Flex>
  );
};
