"use client";
import { Flex, Box, Text } from "@chakra-ui/react";
import { X } from "@boxicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { DATE_OPTIONS, SORT_OPTIONS } from "../constants";

function formatPrice(min?: string | null, max?: string | null) {
  if (!min && !max) return null;
  const fmt = (v: string) => `$${Number(v.replace(/\D/g, "")).toLocaleString("es-AR")}`;
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  if (min) return `Desde ${fmt(min)}`;
  return `Hasta ${fmt(max!)}`;
}

export function ActiveFilterChips() {
  const router = useRouter();
  const sp = useSearchParams();
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  const removeParam = (key: string, extraKeys?: string[]) => {
    const params = new URLSearchParams(sp.toString());
    params.delete(key);
    extraKeys?.forEach((k) => params.delete(k));
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  const cat = sp.get("category");
  if (cat) {
    const label = CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
    chips.push({ key: "category", label, onRemove: () => removeParam("category") });
  }
  const prov = sp.get("province");
  if (prov) chips.push({ key: "province", label: prov, onRemove: () => removeParam("province") });
  const priceLabel = formatPrice(sp.get("min_price"), sp.get("max_price"));
  if (priceLabel) chips.push({ key: "price", label: priceLabel, onRemove: () => removeParam("min_price", ["max_price"]) });
  const date = sp.get("date");
  if (date) {
    const label = DATE_OPTIONS.find((d) => d.id === date)?.label ?? date;
    chips.push({ key: "date", label, onRemove: () => removeParam("date") });
  }
  const cond = sp.get("condition");
  if (cond) {
    const label = CONDITIONS.find((c) => c.id === cond)?.label ?? cond;
    chips.push({ key: "condition", label, onRemove: () => removeParam("condition") });
  }
  const order = sp.get("order_by");
  if (order) {
    const label = SORT_OPTIONS.find((s) => s.id === order)?.label ?? order;
    chips.push({ key: "order_by", label, onRemove: () => removeParam("order_by") });
  }

  if (!chips.length) return null;

  return (
    <Flex gap={2} wrap="wrap" mb={1}>
      {chips.map((c) => (
        <Flex
          key={c.key}
          align="center"
          gap={1}
          bg="white"
          color="neutral.900"
          borderRadius="full"
          px={3}
          py={1}
          boxShadow="base"
          h="28px"
        >
          <Text fontSize="xs" fontWeight="medium">
            {c.label}
          </Text>
          <Box
            as="button"
            onClick={c.onRemove}
            aria-label={`Quitar ${c.label}`}
            ml={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={1}
            borderRadius="full"
            _hover={{ bg: "neutral.50" }}
            minW="24px"
            minH="24px"
          >
            <X width="18px" height="18px" fill="var(--chakra-colors-feedback-error)" />
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}
