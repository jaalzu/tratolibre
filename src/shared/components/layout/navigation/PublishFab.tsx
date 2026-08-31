"use client";

import NextLink from "next/link";
import { Flex, Box } from "@chakra-ui/react";
import { Plus } from "@boxicons/react";

interface PublishFabProps {
  href: string;
  isActive?: boolean;
}

// ─────────────────────────────────────────────────────────────
// TWEAKABLE VALUES — edit these to adjust the FAB:
// ─────────────────────────────────────────────────────────────
// FAB_SIZE         → outer circle diameter (52px = a bit smaller than before)
// FAB_TOP          → how much it sticks out above the navbar (-30px = more top/outstanding)
// ICON_SIZE        → Plus icon size (26px)
// BORDEr/Shadow    → visual style
// ─────────────────────────────────────────────────────────────

const FAB_SIZE = "60px";
const FAB_TOP = "-10px";
const ICON_SIZE = "26px";

export function PublishFab({ href }: PublishFabProps) {
  return (
    // Outer wrapper: absolutely positioned so it truly protrudes above the navbar
    <Box
      position="absolute"
      top={FAB_TOP}
      left="50%"
      transform="translateX(-50%)"
      zIndex={10}
    >
      <NextLink
        href={href}
        aria-label="Publicar artículo"
        style={{ textDecoration: "none", display: "block" }}
      >
        <Flex
          align="center"
          justify="center"
          w={FAB_SIZE}
          h={FAB_SIZE}
          borderRadius="full"
          bg="neutral.50"
          color="var(--chakra-colors-brand-default)"
          border="3px solid var(--chakra-colors-brand-default)"
          boxShadow="none"
          transition="transform 0.13s ease"
          outline="none"
          _hover={{
            transform: "scale(1.06)",
          }}
          _active={{
            transform: "scale(0.94)",
          }}
          _focusVisible={{
            outline: "2px solid var(--chakra-colors-brand-default)",
            outlineOffset: "2px",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Plus
              width={ICON_SIZE}
              height={ICON_SIZE}
              fill="var(--chakra-colors-brand-default)"
            />
          </Box>
        </Flex>
      </NextLink>
    </Box>
  );
}
