'use client'

import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { useSearchFilters } from '../useSearchFilters'
import { CATEGORIES, CONDITIONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { FilterSelect } from './FilterSelect'

const DATE_OPTIONS = [
  { id: 'today', label: 'Hoy' },
  { id: 'week',  label: 'Últimos 7 días' },
  { id: 'month', label: 'Últimos 30 días' },
]

const SORT_OPTIONS = [
  { id: 'closest',        label: 'Más recientes'  },
  { id: 'most_relevance', label: 'Más relevantes' },
  { id: 'price_asc',      label: 'Menor precio'   },
  { id: 'price_desc',     label: 'Mayor precio'   },
]

export function FilterPanel() {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } = useSearchFilters()

  const SectionTitle = ({ children }: { children: string }) => (
    <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">{children}</Text>
  )

  const OptionButton = ({ id, label, active, onClick }: { id: string; label: string; active: boolean; onClick: () => void }) => (
    <Box as="button" onClick={onClick} px={3} py={2} borderRadius="lg" textAlign="left" w="full" transition="all 0.15s"
      bg={active ? 'brand.50' : 'transparent'} border="1px solid" borderColor={active ? 'brand.default' : 'neutral.200'}
    >
      <Text fontSize="sm" color={active ? 'brand.default' : 'neutral.700'} fontWeight={active ? 'bold' : 'normal'}>{label}</Text>
    </Box>
  )

  const provinceOptions = provinces.map(p => ({ id: p.nombre, label: p.nombre }))

  return (
    <Box w="220px" flexShrink={0} display={{ base: 'none', md: 'flex' }} flexDirection="column"
      position="sticky" top="110px" alignSelf="flex-start"
    >
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="sm" color="neutral.900">Filtros</Text>
        <Box as="button" onClick={() => clear()} color="neutral.400" fontSize="xs" _hover={{ color: 'neutral.600' }}>Limpiar</Box>
      </Flex>

      <Stack gap={5}>

        <Box>
          <SectionTitle>ORDENAR POR</SectionTitle>
          <Stack gap={1}>
            {SORT_OPTIONS.map(o => (
              <OptionButton key={o.id} id={o.id} label={o.label} active={filters.orderBy === o.id} onClick={() => setFilter('orderBy', o.id)} />
            ))}
          </Stack>
        </Box>

        <Box>
          <SectionTitle>CATEGORÍA</SectionTitle>
          <FilterSelect
            value={filters.category}
            onChange={val => setFilter('category', val)}
            options={CATEGORIES.map(c => ({ id: c.id, label: c.label }))}
            placeholder="Todas"
          />
        </Box>

        <Box>
          <SectionTitle>UBICACIÓN</SectionTitle>
          <FilterSelect
            value={filters.province}
            onChange={val => setFilter('province', val)}
            options={provinceOptions}
            placeholder="Todas las provincias"
          />
        </Box>

        <Box>
          <SectionTitle>FECHA DE PUBLICACIÓN</SectionTitle>
          <Stack gap={1}>
            {DATE_OPTIONS.map(d => (
              <OptionButton key={d.id} id={d.id} label={d.label} active={filters.date === d.id} onClick={() => toggleFilter('date', d.id)} />
            ))}
          </Stack>
        </Box>

        <Box>
          <SectionTitle>PRECIO</SectionTitle>
          <Flex gap={2} align="center">
            <Box flex={1}>
              <Text fontSize="xs" color="neutral.400" mb={1}>Mínimo</Text>
              <input type="number" placeholder="$ 0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} min={0}
                style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
            </Box>
            <Text color="neutral.300" mt={4}>—</Text>
            <Box flex={1}>
              <Text fontSize="xs" color="neutral.400" mb={1}>Máximo</Text>
              <input type="number" placeholder="$ ∞" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} min={0}
                style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
            </Box>
          </Flex>
        </Box>

        <Box>
          <SectionTitle>ESTADO</SectionTitle>
          <Stack gap={1}>
            {CONDITIONS.map(c => (
              <OptionButton key={c.id} id={c.id} label={c.label} active={filters.condition === c.id} onClick={() => toggleFilter('condition', c.id)} />
            ))}
          </Stack>
        </Box>

      </Stack>

      <Button mt={6} onClick={() => apply()} w="full">Aplicar filtros</Button>
    </Box>
  )
}