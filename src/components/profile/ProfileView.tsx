import { Box } from '@chakra-ui/react'
import { ProfileHeader } from './header/ProfileHeader'
import { ProfileItemsTabs } from './items/ProfileItemsTabs'
import { Profile } from '@/features/profile/types'
import { ItemSummary } from '@/features/items/types'

interface ProfileViewProps {
  profile: Profile
  items: ItemSummary[]
  salesCount: number
  isOwner?: boolean
}

export const ProfileView = ({ profile, items, salesCount, isOwner }: ProfileViewProps) => (
  <Box minH="100vh" bg="neutral.150" px={{ base: 4, md: 8 }}>
    <Box maxW="1200px" mx="auto">
      {/* HEADER */}
      <Box
        bg="neutral.50"
        borderBottomLeftRadius="3xl"
        borderBottomRightRadius="3xl"
        px={{ base: 5, md: 8 }}
        pt={4}
        pb={6}

      >
        <ProfileHeader
          name={profile?.name}
          avatarUrl={profile?.avatar_url}
          location={profile?.location}
          salesCount={salesCount}
          reviewsCount={profile?.reviews_count ?? 0}
          rating={profile?.rating ?? 0}
          isOwner={isOwner}
        />
      </Box>

      {/* ITEMS */}
      <Box
        mt={3}
        bg="neutral.50"
        borderRadius="3xl"
        px={{ base: 5, md: 8 }}
        pt={5}
        pb={24}
        minH="50vh"
      >
        <ProfileItemsTabs items={items} isOwner={isOwner} />
      </Box>
    </Box>
  </Box>
)