"use client";

import { Flex, Text, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, Flag } from "@boxicons/react";

const links = [
  { href: "/admin", label: "Métricas", Icon: BarChart },
  { href: "/admin/reports", label: "Reportes", Icon: Flag },
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
          const LinkIcon = link.Icon;

          return (
            <Box
              key={link.href}
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
                  <LinkIcon width="16px" height="16px" fill="currentColor" />
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
