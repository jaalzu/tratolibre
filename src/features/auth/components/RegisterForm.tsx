"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput } from "@/features/auth/schemas";
import NextLink from "next/link";
import { Flex, Text, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/features/auth/actions";
import { FormField } from "./FormField";

export const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const result = await registerAction(data);
    if (result?.error) setServerError(result.error);
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
            />
            <FormField
              label="Apellido"
              name="lastName"
              register={register}
              error={errors.lastName}
              placeholder="García"
              required
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
          />

          <FormField
            label="Contraseña"
            name="password"
            register={register}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
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

          {serverError && (
            <Text fontSize="xs" color="feedback.error" textAlign="center">
              {serverError}
            </Text>
          )}

          <Button
            type="submit"
            width="full"
            borderRadius="full"
            py={1.5}
            mt={3}
            loading={isSubmitting}
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
