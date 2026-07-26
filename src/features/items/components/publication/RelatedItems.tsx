import { Box, Text } from "@chakra-ui/react";
import { ItemsCarousel } from "./ItemsCarousel";
import { getItems } from "@/features/items/actions";

interface RelatedItemsProps {
  category: string;
  excludeId: string;
  userId?: string | null;
}

export async function RelatedItems({
  category,
  excludeId,
  userId = null,
}: RelatedItemsProps) {
  const result = await getItems({ category });

  if (!result.success) {
    console.error("Error cargando items relacionados:", result.error);
    return null;
  }

  const items = result.data.filter((i) => i.id !== excludeId).slice(0, 8);

  if (!items.length) return null;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" color="neutral.900" mb={4}>
        Otras personas están viendo
      </Text>
      <ItemsCarousel items={items} userId={userId} />
    </Box>
  );
}
