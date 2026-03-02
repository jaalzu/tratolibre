import { Box, Flex, Text } from '@chakra-ui/react'
import { ProfileAvatar } from './ProfileAvatar'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'

interface ProfileHeaderProps {
  name?: string | null
  avatarUrl?: string | null
  location?: string | null
  salesCount: number
  reviewsCount: number
  rating: number
  isOwner?: boolean
}

export const ProfileHeader = ({ name, avatarUrl, location, salesCount, reviewsCount, rating, isOwner }: ProfileHeaderProps) => (
  <Box pt={2} pb={4}>
    {/* Nombre + avatar */}
    <Flex justify="space-between" align="flex-start" mb={3}>
      <Box flex={1} pr={4}>
        <Text fontWeight="bold" fontSize="2xl" color="neutral.900" lineHeight="1.2" mb={1}>{name ?? 'Sin nombre'}</Text>
        <Flex align="center" gap={1}>
          <Text fontSize="sm" color="neutral.900">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</Text>
          <Text fontSize="sm" fontWeight="bold" color="neutral.900">{rating > 0 ? rating.toFixed(1) : '—'}</Text>
          <Text fontSize="xs" color="neutral.400">({reviewsCount})</Text>
        </Flex>
      </Box>

      {/* Avatar + botón editar debajo */}
      <Flex direction="column" align="center" gap={1}>
        <ProfileAvatar avatarUrl={avatarUrl} name={name} size={72} />
        {isOwner && (
  <NextLink href="/profile/edit">
    <Text fontSize="sm" color="accent.default" fontWeight="medium" cursor="pointer">Editar perfil</Text>
  </NextLink>
)}
      </Flex>
    </Flex>

    {/* Stats */}
    <Flex gap={4} mb={2}>
  <Text fontSize="sm" color="neutral.700"><Text as="span" fontWeight="bold">{salesCount}</Text> Ventas</Text>
    </Flex>

    {/* Ubicación */}
    {location && (
      <Flex align="center" gap={1}>
        <i className="bx bx-current-location" style={{ fontSize: '15px', color: 'var(--chakra-colors-neutral-400)' }} />
        <Text fontSize="sm" color="neutral.700">{location}</Text>
      </Flex>
    )}
  </Box>
)