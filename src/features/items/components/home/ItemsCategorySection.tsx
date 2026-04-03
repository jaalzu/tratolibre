import NextLink from "next/link";
import { Box, Flex, Grid, Heading, BoxProps } from "@chakra-ui/react"; // Importamos BoxProps
import { PageContainer } from "@/components/ui/PageContainer";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { Item } from "@/features/items/types";

interface ItemsRowProps extends BoxProps {
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
  ...rest
}: ItemsRowProps) => {
  if (!items.length) return null;

  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={4} {...rest}>
      <Box bg="neutral.50" borderRadius="2xl" p={4} shadow="base" minH="280px">
        <Flex align="center" justify="space-between" mb={2}>
          <Heading as="h2" fontSize="md" fontWeight="bold" color="neutral.900">
            {title}
          </Heading>
          {viewMoreHref && (
            <NextLink href={viewMoreHref} style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "var(--chakra-colors-accent-default)",
                  cursor: "pointer",
                }}
              >
                {viewMoreLabel}
              </span>
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
            "&::-webkit-scrollbar-track": { background: "transparent" },
          }}
        >
          <Grid
            templateColumns={{
              base: `repeat(${items.length}, 190px)`,
              md: `repeat(${items.length}, 226px)`,
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
