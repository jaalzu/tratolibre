'use client'

import { Box } from '@chakra-ui/react'
import { useFavorite } from '@/features/favorites/useFavorite'

interface FavoriteButtonProps {
  itemId: string
  initialFavorited: boolean
  userId: string | null
}

export const FavoriteButton = ({ itemId, initialFavorited, userId }: FavoriteButtonProps) => {
  const { favorited, toggle } = useFavorite(itemId, initialFavorited, userId)

  return (
    <Box
      as="button"
      onClick={toggle}
      cursor="pointer"
      transition="all 0.15s"
      bg="transparent"
      border="none"
      p={0}
      _active={{ transform: 'scale(0.85)' }}
    >
      <i
        className={favorited ? 'bx bxs-heart' : 'bx bx-heart'}
        style={{ fontSize: '20px', color: favorited ? '#e53e3e' : '#a0aec0' }}
      />
    </Box>
  )
}