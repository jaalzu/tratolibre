"use client";

import { Box } from "@chakra-ui/react";
import { useFavorite } from "@/features/favorites/useFavorite";
import { Heart } from "@boxicons/react";
interface FavoriteButtonProps {
  itemId: string;
  initialFavorited: boolean;
  userId: string | null;
}

export const FavoriteButton = ({
  itemId,
  initialFavorited,
  userId,
}: FavoriteButtonProps) => {
  const { favorited, toggle } = useFavorite(itemId, initialFavorited, userId);

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
      {favorited ? (
        <Heart width="22px" height="22px" fill="#e53e3e" />
      ) : (
        <Heart width="22px" height="22px" fill="#a0aec0" />
      )}
    </Box>
  );
};
