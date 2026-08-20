"use client";

import { Box, SimpleGrid, Text, Flex, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { ProfileItemCard } from "./ProfileItemCard";
import { ItemSummary } from "@/features/items/types";
import { EmptyState } from "@/shared/components/ui/EmptyState";

interface ProfileItemsTabsProps {
  items: ItemSummary[];
  isOwner?: boolean;
}

const tabs = [
  { key: "active", label: "En venta" },
  { key: "sold", label: "Vendidos" },
] as const;

export const ProfileItemsTabs = ({ items, isOwner }: ProfileItemsTabsProps) => {
  const [tab, setTab] = useState<"active" | "sold">("active");

  const active = items.filter((i) => !i.sold);
  const sold = items.filter((i) => i.sold);
  const current = tab === "active" ? active : sold;

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const idx = tabs.findIndex((t) => t.key === tab);
      const next = tabs[(idx + dir + tabs.length) % tabs.length];
      setTab(next.key);
      e.currentTarget
        .querySelector<HTMLElement>(`[data-tab="${next.key}"]`)
        ?.focus();
    }
  };

  return (
    <Box>
      <Flex
        justify="center"
        gap={10}
        mb={8}
        role="tablist"
        aria-label="Mis publicaciones"
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((t) => {
          const count = t.key === "active" ? active.length : sold.length;
          const isActive = tab === t.key;
          return (
            <chakra.button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-tab={t.key}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setTab(t.key)}
              cursor="pointer"
              textAlign="center"
              bg="transparent"
              border="none"
              p="0"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={isActive ? "neutral.900" : "neutral.400"}
              >
                {count}
              </Text>
              <Text
                fontSize="md"
                fontWeight={isActive ? "bold" : "normal"}
                color={isActive ? "neutral.900" : "neutral.400"}
                borderBottom="2px solid"
                borderColor={isActive ? "brand.default" : "transparent"}
                pb={0.5}
                transition="all 0.15s"
              >
                {t.label}
              </Text>
            </chakra.button>
          );
        })}
      </Flex>

      {current.length === 0 ? (
        <EmptyState
          image="/svg/nothing-here.svg"
          imageAlt="Buzon vacío"
          title={
            tab === "active"
              ? "No hay publicaciones activas"
              : "No hay artículos vendidos"
          }
          actionLabel={
            tab === "active" && isOwner ? "Empezá a vender" : undefined
          }
          actionHref={tab === "active" && isOwner ? "/item/new" : undefined}
        />
      ) : (
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
          {current.map((item) => (
            <ProfileItemCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
