"use client";

import { Flex, Text, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Métricas", icon: "bx-bar-chart-alt-2" },
  { href: "/admin/reports", label: "Reportes", icon: "bx-flag" },
];

export function AdminNav() {
  const pathname = usePathname();
  const current = links.find((l) => l.href === pathname) ?? links[0];

  return (
    <Flex direction="column" gap={3}>
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
        color="neutral.800"
      >
        {current.label}
      </Text>
      <Flex gap={2}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Box
              key={link.href}
              asChild
              px={4}
              py={2}
              borderRadius="xl"
              bg={isActive ? "brand.default" : "neutral.150"}
              color={isActive ? "neutral.50" : "fg.muted"}
              transition="all 0.15s"
              _hover={{ bg: isActive ? "brand.default" : "neutral.200" }}
            >
              <NextLink href={link.href}>
                <Flex align="center" gap={2}>
                  <i
                    className={`bx ${link.icon}`}
                    style={{ fontSize: "16px" }}
                  />
                  <Text fontSize="sm" fontWeight="medium">
                    {link.label}
                  </Text>
                </Flex>
              </NextLink>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}
