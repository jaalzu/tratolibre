"use client";

import { Box } from "@chakra-ui/react";
import { useFavorite } from "@/features/favorites/useFavorite";
import { Heart } from "@boxicons/react";

interface FavoriteButtonProps {
  itemId: string;
  initialFavorited?: boolean;
  userId: string | null;
}

export const FavoriteButton = ({
  itemId,
  initialFavorited,
  userId,
}: FavoriteButtonProps) => {
  // El hook ya sabe manejar si initialFavorited es undefined
  const { favorited, toggle } = useFavorite(itemId, userId, initialFavorited);

  return (
    <Box
      as="button"
      onClick={toggle}
      aria-label="Boton de Favorito"
      cursor="pointer"
      transition="all 0.15s"
      bg="transparent"
      border="none"
      p={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      _active={{ transform: "scale(0.85)" }}
    >
      <Heart
        width="22px"
        height="22px"
        fill={favorited ? "#e53e3e" : "#a0aec0"}
      />
    </Box>
  );
};
