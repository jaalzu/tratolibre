// features/admin/components/ReportsList.tsx
'use client'

import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { ReportCard } from './ReportCard'

const TYPE_FILTERS = [
  { value: 'all',          label: 'Todos' },
  { value: 'item',         label: 'Publicaciones' },
  { value: 'user',         label: 'Usuarios' },
  { value: 'conversation', label: 'Conversaciones' },
]

const STATUS_FILTERS = [
  { value: 'all',       label: 'Todos' },
  { value: 'pending',   label: 'Pendientes' },
  { value: 'reviewed',  label: 'Revisados' },
  { value: 'dismissed', label: 'Desestimados' },
]

interface ReportsListProps {
  reports: any[]
}

export function ReportsList({ reports }: ReportsListProps) {
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('pending')

  const filtered = reports.filter(r => {
    const matchType   = type === 'all'   || r.type === type
    const matchStatus = status === 'all' || r.status === status
    return matchType && matchStatus
  })

  return (
    <Box>
      {/* Filtros */}
      <Flex gap={6} mb={6} flexWrap="wrap">
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
            Tipo
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {TYPE_FILTERS.map(f => (
              <Box
                key={f.value}
                as="button"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                bg={type === f.value ? 'brand.default' : 'neutral.150'}
                color={type === f.value ? 'white' : 'fg.muted'}
                onClick={() => setType(f.value)}
                transition="all 0.15s"
                cursor="pointer"
              >
                {f.label}
              </Box>
            ))}
          </Flex>
        </Box>

        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
            Estado
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {STATUS_FILTERS.map(f => (
              <Box
                key={f.value}
                as="button"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                bg={status === f.value ? 'brand.default' : 'neutral.150'}
                color={status === f.value ? 'white' : 'fg.muted'}
                onClick={() => setStatus(f.value)}
                transition="all 0.15s"
                cursor="pointer"
              >
                {f.label}
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>

      {/* Lista */}
      {filtered.length === 0 ? (
        <Flex justify="center" py={12}>
          <Text fontSize="sm" color="fg.muted">No hay reportes para estos filtros.</Text>
        </Flex>
      ) : (
        <Stack gap={3}>
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} />
          ))}
        </Stack>
      )}
    </Box>
  )
}