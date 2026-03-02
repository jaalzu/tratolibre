import { getUserProfile } from '@/features/profile/actions'
import { ProfileHeader } from '@/components/profile/header/ProfileHeader'
import { ProfileItemsList } from '@/components/profile/items/ProfileItemsList'
import { ReviewsList } from '@/components/profile/reviews/ReviewsList'
import { PageContainer } from '@/components/ui/PageContainer'
import { Box, Text } from '@chakra-ui/react'
import { notFound } from 'next/navigation'

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getUserProfile(id)
  if (!data) notFound()

  const { profile, items, reviews, salesCount } = data

  return (
    <PageContainer maxW="600px">
      <ProfileHeader
        name={profile.name}
        avatarUrl={profile.avatar_url}
        location={profile.location}
        salesCount={salesCount}
        reviewsCount={profile.reviews_count ?? 0}
        rating={profile.rating ?? 0}
      />

      <Box mt={6}>
        <Text fontWeight="bold" fontSize="md" color="neutral.900" mb={3}>Publicaciones</Text>
        <ProfileItemsList items={items} emptyMessage="No tiene publicaciones activas" />
      </Box>

      <Box mt={6}>
        <Text fontWeight="bold" fontSize="md" color="neutral.900" mb={3}>Reseñas</Text>
        <ReviewsList reviews={reviews} />
      </Box>
    </PageContainer>
  )
}