"use client";

import { Box, Flex, Separator, Text } from "@chakra-ui/react";
import ItemImageSlider from "./ItemImageSlider";
import ItemInfo from "./ItemInfo";
import ItemDetails from "./ItemDetails";
import SellerCard from "./SellerCard";
import ItemActions from "./ItemActions";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useItem } from "@/shared/hooks/useItem";
import type { ItemWithProfile } from "@/features/items/types";

interface ItemPageContentProps {
  itemId: string;
  initialItem: ItemWithProfile;
  userId: string | null;
  isAdmin?: boolean;
}

export default function ItemPageContent({
  itemId,
  initialItem,
  userId,
  isAdmin = false,
}: ItemPageContentProps) {
  const { data: item } = useItem(itemId, initialItem);

  const currentItem = item || initialItem;

  return (
    <Box pb={{ base: "0px", md: 0 }} suppressHydrationWarning>
      <ScrollToTop />
      {/* ── MOBILE ── */}
      <Box display={{ base: "block", md: "none" }}>
        <Box pt={0}>
          <ItemImageSlider
            images={currentItem.images ?? []}
            title={currentItem.title}
          />
        </Box>

        <Box px={4} pt={2}>
          <ItemInfo item={currentItem} />

          <Box mt={4}>
            <SellerCard
              profile={currentItem.profiles}
              itemId={currentItem.id}
              userId={userId}
            />
          </Box>

          {currentItem.category && (
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
                {currentItem.category}
              </Text>
            </Box>
          )}

          <Separator my={5} borderColor="neutral.100" />
          <ItemDetails item={currentItem} userId={userId} />
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
          <ItemActions item={currentItem} userId={userId} isAdmin={isAdmin} />
        </Box>
      </Box>

      {/* ── DESKTOP ── */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="900px" mx="auto" px={10} py={5}>
          <Breadcrumb
            category={currentItem.category}
            title={currentItem.title}
          />
          <Flex gap={10} align="start">
            <Box flex="1" minW={0}>
              <ItemImageSlider
                images={currentItem.images ?? []}
                title={currentItem.title}
              />

              {currentItem.category && (
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
                    {currentItem.category}
                  </Text>
                </Box>
              )}

              <Separator my={6} borderColor="neutral.100" />
              <ItemDetails item={currentItem} userId={userId} />
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
                  <ItemInfo item={currentItem} />
                  <Box mt={5}>
                    <ItemActions
                      item={currentItem}
                      userId={userId}
                      isAdmin={isAdmin}
                    />
                  </Box>
                </Box>
                <SellerCard
                  profile={currentItem.profiles}
                  itemId={currentItem.id}
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
