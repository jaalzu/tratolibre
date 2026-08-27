"use client";

import NextLink from "next/link";
import { Flex, Text, Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  variant?: "desktop" | "mobile";
  badge?: number;
}

export default function NavLink({
  href,
  label,
  icon: IconComponent,
  variant = "desktop",
  badge = 0,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isMobile = variant === "mobile";

  return (
    <NextLink
      href={href}
      aria-label={label}
      style={{
        textDecoration: "none",
        display: "flex",
        height: "100%",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        w={isMobile ? "100%" : "auto"}
        minW={isMobile ? "auto" : "56px"}
        h="full"
        px={isMobile ? 1 : 2}
        py={isMobile ? 1 : 1}
        gap={isMobile ? "1px" : undefined}
        transform={isMobile ? "translateY(-2px)" : undefined}
        opacity={isMobile ? (isActive ? 1 : 0.9) : 1}
        _hover={{
          bg: isMobile ? "transparent" : "rgba(255,255,255,0.08)",
          opacity: 1,
        }}
        transition="all 0.13s ease"
        cursor="pointer"
        position="relative"
        borderRadius="md"
      >
        <Box
          position="relative"
          display="inline-flex"
          transition="all 0.13s ease"
          transform={isMobile && isActive ? "scale(1.05)" : "scale(1)"}
        >
          <IconComponent
            width={isMobile ? (isActive ? "25px" : "24px") : "22px"}
            height={isMobile ? (isActive ? "25px" : "24px") : "22px"}
            fill="var(--chakra-colors-neutral-50)"
            style={{ transition: "all 0.13s ease" }}
          />

          {badge > 0 && (
            <Box
              position="absolute"
              top="-3px"
              right="-7px"
              bg="feedback.error"
              color="white"
              borderRadius="full"
              minW="15px"
              h="15px"
              fontSize="9px"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
              lineHeight="1"
              zIndex={1}
            >
              {badge > 9 ? "9+" : badge}
            </Box>
          )}
        </Box>

        <Text
          fontSize={isMobile ? (isActive ? "11px" : "10px") : "xs"}
          fontWeight={isActive ? "bold" : "medium"}
          color="neutral.50"
          textAlign="center"
          lineHeight="1"
          mt={isMobile ? "5px" : 0.5}
          transform={isMobile ? "translateY(-1px)" : undefined}
          transition="all 0.13s ease"
          letterSpacing="0.3px"
        >
          {label}
        </Text>
      </Flex>
    </NextLink>
  );
}
