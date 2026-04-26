import NextLink from "next/link";
import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Item } from "@/features/items/types";

interface ItemCardProps {
  obj: Item;
  userId?: string | null;
  initialFavorited?: boolean;
  priority?: boolean;
}

export const ItemCard = ({
  obj,
  userId = null,
  initialFavorited = false,
  priority = false,
}: ItemCardProps) => {
  return (
    <NextLink href={`/item/${obj.id}`} style={{ textDecoration: "none" }}>
      <Box
        w="full"
        transition="transform 0.2s ease"
        _hover={{ transform: "translateY(-2px)" }}
      >
        <Box
          position="relative"
          w="full"
          h="240px"
          borderRadius="5px"
          overflow="hidden"
          bg="neutral.100"
        >
          {obj.images?.[0] ? (
            <Image
              src={obj.images[0]}
              alt={obj.title}
              fill
              sizes="(max-width: 768px) 190px, 226px"
              style={{ objectFit: "cover" }}
              priority={priority}
              loading={priority ? "eager" : "lazy"} // ✅ eager si es priority
            />
          ) : (
            <Box w="full" h="full" bg="neutral.100" />
          )}
        </Box>

        <Box pt={2}>
          <Flex justify="space-between" align="center">
            {obj.sale_price && (
              <Text fontSize="md" fontWeight="bold" color="neutral.900">
                ${obj.sale_price.toLocaleString("es-AR")}
              </Text>
            )}
            <FavoriteButton
              itemId={obj.id}
              initialFavorited={initialFavorited}
              userId={userId}
            />
          </Flex>
          <Text fontSize="md" color="neutral.700" lineClamp={1}>
            {obj.title}
          </Text>
        </Box>
      </Box>
    </NextLink>
  );
};
