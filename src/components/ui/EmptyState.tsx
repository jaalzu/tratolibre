import { Flex, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { ReactNode } from 'react'
import NextLink from 'next/link'

interface EmptyStateProps {
  image?:        string
  imageAlt?:     string
  icon?:         ReactNode
  title:         string
  description?:  string
  actionLabel?:  string
  actionHref?:   string
}

export function EmptyState({ image, imageAlt, icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <Flex direction="column" align="center" justify="center" gap={3} py={8} px={4} textAlign="center">
      {icon && icon}
      {image && <img src={image} alt={imageAlt ?? title} style={{ width: '220px', opacity: 0.85 }} />}
      <Text fontSize="lg" fontWeight="bold" color="neutral.800">{title}</Text>
      {description && (
        <Text fontSize="sm" color="neutral.400" maxW="320px">{description}</Text>
      )}
      {actionLabel && actionHref && (
        <Button asChild borderRadius="full" py={2} px={6} mt={1}>
          <NextLink href={actionHref}>{actionLabel}</NextLink>
        </Button>
      )}
    </Flex>
  )
}