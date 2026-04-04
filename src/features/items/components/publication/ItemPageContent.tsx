// features/items/components/publication/ItemPageContent.tsx
"use client";

import { Box, Flex, Separator, Text } from "@chakra-ui/react";
import ItemImageSlider from "./ItemImageSlider";
import ItemInfo from "./ItemInfo";
import ItemDetails from "./ItemDetails";
import SellerCard from "./SellerCard";
import ItemActions from "./ItemActions";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useItem } from "@/features/items/hooks/useItem";
import { ItemPageSkeleton } from "./ItemPageSkeleton";

interface ItemPageContentProps {
  itemId: string; // ← Ahora solo recibe el ID
  userId: string | null;
  isAdmin?: boolean;
}

export default function ItemPageContent({
  itemId,
  userId,
  isAdmin = false,
}: ItemPageContentProps) {
  // Usar el hook para obtener el item del cache o hacer fetch
  const { data: item, isLoading } = useItem(itemId);

  // Mostrar skeleton mientras carga
  if (isLoading || !item) {
    return <ItemPageSkeleton />;
  }

  return (
    <Box pb={{ base: "0px", md: 0 }} suppressHydrationWarning>
      <ScrollToTop />
      {/* ── MOBILE ── */}
      <Box display={{ base: "block", md: "none" }}>
        <Box pt={0}>
          <ItemImageSlider images={item.images ?? []} title={item.title} />
        </Box>

        <Box px={4} pt={2}>
          <ItemInfo item={item} />

          <Box mt={4}>
            <SellerCard
              profile={item.profiles}
              itemId={item.id}
              userId={userId}
            />
          </Box>

          {item.category && (
            <Box
              display="inline-block"
              mt={4}
              px={5}
              py={1}
              bg="neutral.100"
              borderRadius="full"
            >
              <Text
                fontSize="md"
                color="neutral.900"
                textTransform="capitalize"
              >
                {item.category}
              </Text>
            </Box>
          )}

          <Separator my={5} borderColor="neutral.100" />
          <ItemDetails item={item} userId={userId} />
        </Box>

        <Box
          position="fixed"
          bottom="60px"
          left={0}
          right={0}
          px={4}
          py={3}
          bg="neutral.150"
          borderTop="1px solid"
          borderColor="neutral.300"
          zIndex={40}
        >
          <ItemActions item={item} userId={userId} isAdmin={isAdmin} />
        </Box>
      </Box>

      {/* ── DESKTOP ── */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={5}>
          <Breadcrumb category={item.category} title={item.title} />
          <Flex gap={10} align="start">
            <Box flex="1" minW={0}>
              <ItemImageSlider images={item.images ?? []} title={item.title} />

              {item.category && (
                <Box
                  display="inline-block"
                  mt={4}
                  mx={3}
                  px={5}
                  py={1}
                  bg="neutral.100"
                  borderRadius="full"
                >
                  <Text
                    fontSize="md"
                    color="neutral.900"
                    textTransform="capitalize"
                  >
                    {item.category}
                  </Text>
                </Box>
              )}

              <Separator my={6} borderColor="neutral.100" />
              <ItemDetails item={item} userId={userId} />
            </Box>

            <Box w="300px" flexShrink={0}>
              <Box position="sticky" top="24px">
                <Box
                  border="1px solid"
                  boxShadow="base"
                  borderColor="neutral.900"
                  borderRadius="xl"
                  bg="neutral.150"
                  px={4}
                  py={6}
                  mb={3}
                >
                  <ItemInfo item={item} />
                  <Box mt={5}>
                    <ItemActions
                      item={item}
                      userId={userId}
                      isAdmin={isAdmin}
                    />
                  </Box>
                </Box>
                <SellerCard
                  profile={item.profiles}
                  itemId={item.id}
                  userId={userId}
                />
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
