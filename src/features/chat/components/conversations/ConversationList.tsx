"use client";

import { Box, Flex, Stack, Text, chakra } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { ConversationItem } from "./ConversationItem";
import { conversationsQuery } from "@/features/chat/queries";
import type { ConversationExtended } from "@/features/chat/schemas";

interface ConversationListProps {
  activeId?: string;
  userId: string;
}

export const ConversationList = ({
  activeId,
  userId,
}: ConversationListProps) => {
  const { data: conversations = [], isLoading: loading } =
    useQuery(conversationsQuery);
  const [filter, setFilter] = useState<"all" | "unread" | "buying" | "selling" | "oldest">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredConversations = conversations
    .filter((conv: ConversationExtended) => {
      if (filter === "unread") {
        return !!conv.hasUnread;
      }
      if (filter === "buying") {
        return conv.buyer_id === userId;
      }
      if (filter === "selling") {
        return conv.seller_id === userId;
      }
      return true;
    })
    .sort((a: ConversationExtended, b: ConversationExtended) => {
      if (filter === "oldest") {
        const dateA = new Date(a.created_at ?? 0).getTime();
        const dateB = new Date(b.created_at ?? 0).getTime();
        return dateA - dateB;
      }
      return 0;
    });

  return (
    <Flex
      direction="column"
      w={{ base: "full", md: "320px" }}
      flexShrink={0}
      borderRightWidth={{ base: "0", md: "2px" }}
      borderColor="neutral.100"
      h="full"
      overflow="hidden"
    >
      <Flex
        px="4"
        py="5"
        borderBottom="1px solid"
        borderColor="neutral.100"
        align="center"
        justify="space-between"
        position="relative"
      >
        <Text fontSize="md" fontWeight="bold" color="neutral.900">
          Bandeja de entrada
        </Text>
        <Box position="relative" ref={filterRef}>
          <chakra.button
            type="button"
            fontSize="sm"
            fontWeight="bold"
            color="accent.default"
            cursor="pointer"
            bg="transparent"
            border="none"
            p={0}
            _hover={{ textDecoration: "underline" }}
            onClick={() => setFilterOpen((o) => !o)}
          >
            Filtrar {filter !== "all" ? "•" : ""}
          </chakra.button>

          {filterOpen && (
            <Box
              position="absolute"
              top="calc(100% + 4px)"
              right={0}
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.200"
              borderRadius="lg"
              boxShadow="md"
              zIndex={50}
              w="150px"
              py={1}
            >
              <chakra.button
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={2}
                fontSize="xs"
                bg={filter === "all" ? "brand.subtle" : "transparent"}
                color={filter === "all" ? "brand.default" : "neutral.600"}
                fontWeight={filter === "all" ? "bold" : "normal"}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setFilter("all");
                  setFilterOpen(false);
                }}
                _hover={{ bg: "neutral.100" }}
              >
                Todas
              </chakra.button>
              <chakra.button
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={2}
                fontSize="xs"
                bg={filter === "unread" ? "brand.subtle" : "transparent"}
                color={filter === "unread" ? "brand.default" : "neutral.600"}
                fontWeight={filter === "unread" ? "bold" : "normal"}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setFilter("unread");
                  setFilterOpen(false);
                }}
                _hover={{ bg: "neutral.100" }}
              >
                No leídas
              </chakra.button>
              <chakra.button
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={2}
                fontSize="xs"
                bg={filter === "buying" ? "brand.subtle" : "transparent"}
                color={filter === "buying" ? "brand.default" : "neutral.600"}
                fontWeight={filter === "buying" ? "bold" : "normal"}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setFilter("buying");
                  setFilterOpen(false);
                }}
                _hover={{ bg: "neutral.100" }}
              >
                Como comprador
              </chakra.button>
              <chakra.button
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={1.5}
                fontSize="xs"
                bg={filter === "selling" ? "brand.subtle" : "transparent"}
                color={filter === "selling" ? "brand.default" : "neutral.600"}
                fontWeight={filter === "selling" ? "bold" : "normal"}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setFilter("selling");
                  setFilterOpen(false);
                }}
                _hover={{ bg: "neutral.100" }}
              >
                Como vendedor
              </chakra.button>
              <chakra.button
                type="button"
                w="full"
                textAlign="left"
                px={3}
                py={1.5}
                fontSize="xs"
                bg={filter === "oldest" ? "brand.subtle" : "transparent"}
                color={filter === "oldest" ? "brand.default" : "neutral.600"}
                fontWeight={filter === "oldest" ? "bold" : "normal"}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setFilter("oldest");
                  setFilterOpen(false);
                }}
                _hover={{ bg: "neutral.100" }}
              >
                Por antigüedad
              </chakra.button>
            </Box>
          )}
        </Box>
      </Flex>

      <Box
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-neutral-200)",
            borderRadius: "100px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "var(--chakra-colors-neutral-300)",
          },
        }}
      >
        {loading ? (
          <Stack gap={0}>
            {[...Array(6)].map((_, i) => (
              <Flex key={i} gap={3} align="center" px={4} py={3}>
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="xl"
                  bg="neutral.100"
                  flexShrink={0}
                />
                <Box flex="1">
                  <Box
                    w="70%"
                    h="13px"
                    bg="neutral.100"
                    borderRadius="md"
                    mb={1.5}
                  />
                  <Box w="50%" h="11px" bg="neutral.100" borderRadius="md" />
                </Box>
              </Flex>
            ))}
          </Stack>
        ) : filteredConversations.length === 0 ? (
          <Flex h="full" align="center" justify="center" p={4}>
            <Text fontSize="sm" color="neutral.400" textAlign="center">
              No hay conversaciones con este filtro
            </Text>
          </Flex>
        ) : (
          <Stack gap="0">
            {filteredConversations.map((conv: ConversationExtended) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeId === conv.id}
                userId={userId}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Flex>
  );
};
