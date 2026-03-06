import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'

interface ProfileAvatarProps {
  avatarUrl?: string | null
  name?: string | null
  size?: number
}

export const ProfileAvatar = ({ avatarUrl, name, size = 80 }: ProfileAvatarProps) => (
  <Box position="relative" w={`${size}px`} h={`${size}px`} borderRadius="full" overflow="hidden" flexShrink={0}>
    {avatarUrl ? (
      <Image src={avatarUrl} alt={name ?? 'Usuario'} fill style={{ objectFit: 'cover' }} />
    ) : (
      <Flex w="full" h="full" bg="brand.default" align="center" justify="center">
        <Text fontSize={`${size / 2.5}px`} fontWeight="bold" color="white">
          {name?.[0]?.toUpperCase() ?? '?'}
        </Text>
      </Flex>
    )}
  </Box>
)