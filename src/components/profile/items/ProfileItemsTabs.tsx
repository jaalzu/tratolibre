'use client'

import { Box, SimpleGrid, Text, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { ProfileItemCard } from './ProfileItemCard'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

interface ProfileItemsTabsProps {
  items: any[]
  isOwner?: boolean
}

const tabs = [
  { key: 'active', label: 'En venta' },
  { key: 'sold', label: 'Vendidos' },
] as const

export const ProfileItemsTabs = ({ items, isOwner }: ProfileItemsTabsProps) => {
  const [tab, setTab] = useState<'active' | 'sold'>('active')

  const active = items.filter(i => !i.sold)
  const sold = items.filter(i => i.sold)
  const current = tab === 'active' ? active : sold

  return (
    <Box>
      <Flex borderBottom="1px solid" borderColor="neutral.100" mb={4}>
        {tabs.map((t) => (
          <Box
            key={t.key}
            onClick={() => setTab(t.key)}
            cursor="pointer"
            pb={2}
            px={1}
            mr={6}
            borderBottom="2px solid"
            borderColor={tab === t.key ? 'accent.default' : 'transparent'}
          >
            <Text fontSize="sm" fontWeight={tab === t.key ? 'bold' : 'normal'} color={tab === t.key ? 'neutral.900' : 'neutral.400'}>
              {t.key === 'active' ? active.length : sold.length} {t.label}
            </Text>
          </Box>
        ))}
      </Flex>

      {current.length === 0 ? (
        <Flex direction="column" align="center" py={10} gap={3}>
          <Text fontSize="sm" color="neutral.400">
            {tab === 'active' ? 'No tenés publicaciones activas' : 'No tenés artículos vendidos'}
          </Text>
          {tab === 'active' && isOwner && (
            <Button asChild size="sm" borderRadius="full">
              <NextLink href="/item/new">Publicar</NextLink>
            </Button>
          )}
        </Flex>
      ) : (
        <SimpleGrid columns={2} gap={3}>
          {current.map(item => (
            <ProfileItemCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}