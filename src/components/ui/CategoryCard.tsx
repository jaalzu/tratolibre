import NextLink from 'next/link'
import { Flex, Text } from '@chakra-ui/react'

interface CategoryCardProps {
  id: string
  label: string
  icon: string
}

export const CategoryCard = ({ id, label, icon }: CategoryCardProps) => {
  return (
    <NextLink href={`/explore?category=${id}`} style={{ textDecoration: 'none' }}>
      <Flex
        direction="column"
        align="center"
        gap={1}
        p={3}
        borderRadius="md"
        textAlign="center"
        transition="transform 0.2s ease"
        _hover={{ transform: 'translateY(-2px)' }}
      >
        <Text fontSize="2xl">{icon}</Text>
        <Text fontSize="xs" fontWeight="medium" color="neutral.500">{label}</Text>
      </Flex>
    </NextLink>
  )
}