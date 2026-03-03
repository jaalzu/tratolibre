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
      <Flex justify="center" gap={10} mb={8}>
        {tabs.map((t) => {
          const count = t.key === 'active' ? active.length : sold.length
          const isActive = tab === t.key
          return (
            <Box key={t.key} onClick={() => setTab(t.key)} cursor="pointer" textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color={isActive ? 'neutral.900' : 'neutral.400'}>
                {count}
              </Text>
              <Text
                fontSize="md"
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? 'neutral.900' : 'neutral.400'}
                borderBottom="2px solid"
                borderColor={isActive ? 'brand.default' : 'transparent'}
                pb={0.5}
                transition="all 0.15s"
              >
                {t.label}
              </Text>
            </Box>
          )
        })}
      </Flex>

      {current.length === 0 ? (
        <Flex direction="column" align="center" py={5} gap={3}>
          <img src="/svg/nothing-here.svg" alt="Sin artículos" style={{ width: '280px', opacity: 0.7 }} />
          <Text fontSize="sm" color="neutral.400">
            {tab === 'active' ? 'No hay publicaciones activas' : 'No hay artículos vendidos'}
          </Text>
          {tab === 'active' && isOwner && (
            <Button asChild size="md" p={3} borderRadius="full">
              <NextLink href="/item/new">Empezá a vender</NextLink>
            </Button>
          )}
        </Flex>
      ) : (
       <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
          {current.map(item => (
            <ProfileItemCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}