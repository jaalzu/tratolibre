import NextLink from "next/link";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { Item } from "@/features/items/types";

interface ItemsRowProps {
  title: string;
  items: Item[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
  userId?: string | null;
  favoriteIds?: string[];
  isPrioritySection?: boolean;
}

export const ItemsCategorySection = ({
  title,
  items,
  viewMoreHref,
  viewMoreLabel = "Ver más",
  userId = null,
  favoriteIds = [],
  isPrioritySection = false,
}: ItemsRowProps) => {
  if (!items.length) return null;

  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={4} suppressHydrationWarning>
      <Box bg="neutral.50" borderRadius="2xl" p={4} shadow="base">
        <Flex align="center" justify="space-between" mb={2}>
          <Heading as="h2" fontSize="md" fontWeight="bold" color="neutral.900">
            {title}
          </Heading>
          {viewMoreHref && (
            <NextLink href={viewMoreHref} style={{ textDecoration: "none" }}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="accent.default"
                _hover={{ color: "accent.hover" }}
              >
                {viewMoreLabel}
              </Text>
            </NextLink>
          )}
        </Flex>

        <Box borderTop="1px solid" borderColor="neutral.100" mb={3} mx={-4} />

        <Box
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "100px",
              background: "#c1c1c1",
            },
          }}
        >
          <Grid
            templateColumns={{
              base: "repeat(10, 190px)",
              md: "repeat(10, 226px)",
            }}
            gap={{ base: "10px", md: "20px" }}
          >
            {items.map((obj: Item, index: number) => (
              <ItemCard
                key={obj.id}
                obj={obj}
                userId={userId}
                initialFavorited={favoriteIds.includes(obj.id)}
                priority={isPrioritySection && index < 4}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
};
