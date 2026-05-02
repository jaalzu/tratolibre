"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client/browser"; // ✅ BROWSER CLIENT

interface SocialButtonsProps {
  mode: "login" | "register";
  showEmail?: boolean;
  onEmailClick?: () => void;
}

export const SocialButtons = ({
  mode,
  showEmail,
  onEmailClick,
}: SocialButtonsProps) => {
  const handleGoogle = async () => {
    const supabase = createClient(); // ✅ Ya no es async import

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const googleLabel =
    mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google";
  const emailLabel =
    mode === "login" ? "Iniciar sesión con email" : "Registrarse con email";

  const buttons = [
    {
      label: googleLabel,
      icon: "/svg/google.svg",
      onClick: handleGoogle,
    },
    ...(showEmail && onEmailClick
      ? [
          {
            label: emailLabel,
            icon: "/svg/email.svg",
            onClick: onEmailClick,
          },
        ]
      : []),
  ];

  const inner = (icon: string, label: string) => (
    <Flex align="center" justify="center" gap={2} w="full">
      <Box w="20px" h="20px" position="relative" flexShrink={0}>
        <Image
          src={icon}
          alt={label}
          fill
          sizes="20px"
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Text fontSize="sm" fontWeight="bold">
        {label}
      </Text>
    </Flex>
  );

  return (
    <Flex direction="column" gap={3}>
      {buttons.map(({ label, icon, onClick }) => (
        <Button
          key={label}
          py={1.5}
          width="full"
          variant="secondary"
          borderRadius="full"
          onClick={onClick}
        >
          {inner(icon, label)}
        </Button>
      ))}
    </Flex>
  );
};
