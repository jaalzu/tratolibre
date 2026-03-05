'use client'

import { Box, Flex, Text, Stack, NativeSelect, IconButton } from '@chakra-ui/react'
import { useSearchFilters } from './useSearchFilters'
import { CATEGORIES, CONDITIONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import 'boxicons/css/boxicons.min.css'

const DATE_OPTIONS = [
  { id: 'today', label: 'Hoy' },
  { id: 'week',  label: 'Últimos 7 días' },
  { id: 'month', label: 'Últimos 30 días' },
]

const selectStyles = {
  borderColor: 'neutral.200',
  borderRadius: 'lg',
  h: '40px',
  fontSize: 'sm',
}

interface FilterDrawerProps {
  open:    boolean
  onClose: () => void
}

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } = useSearchFilters()

  return (
    <>
      {open && (
        <Box position="fixed" inset={0} bg="blackAlpha.400" zIndex={200} onClick={onClose} />
      )}

      <Box
        position="fixed" top={0} left={0} h="100vh" w="280px"
        bg="white" zIndex={201}
        transform={open ? 'translateX(0)' : 'translateX(-100%)'}
        transition="transform 0.25s ease"
        display="flex" flexDirection="column"
        boxShadow="lg"
      >
        <Flex align="center" justify="space-between" px={4} py={4} borderBottom="1px solid" borderColor="neutral.100">
          <Text fontWeight="bold" fontSize="md" color="neutral.900">Filtros</Text>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <i className="bx bx-x" style={{ fontSize: '20px' }} />
          </IconButton>
        </Flex>

        <Box overflowY="auto" flex={1} px={4} py={4}>
          <Stack gap={5}>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">CATEGORÍA</Text>
              <NativeSelect.Root>
                <NativeSelect.Field {...selectStyles} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                  <option value="">Todas</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">UBICACIÓN</Text>
              <NativeSelect.Root>
                <NativeSelect.Field {...selectStyles} value={filters.province} onChange={e => setFilter('province', e.target.value)}>
                  <option value="">Todas las provincias</option>
                  {provinces.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">FECHA DE PUBLICACIÓN</Text>
              <Stack gap={1}>
                {DATE_OPTIONS.map(d => (
                  <Box key={d.id} as="button" onClick={() => toggleFilter('date', d.id)}
                    px={3} py={2} borderRadius="lg" textAlign="left" w="full" transition="all 0.15s"
                    bg={filters.date === d.id ? 'brand.50' : 'transparent'}
                    border="1px solid" borderColor={filters.date === d.id ? 'brand.default' : 'neutral.200'}
                  >
                    <Text fontSize="sm" color={filters.date === d.id ? 'brand.default' : 'neutral.700'} fontWeight={filters.date === d.id ? 'bold' : 'normal'}>
                      {d.label}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">PRECIO</Text>
              <Flex gap={2} align="center">
                <Box flex={1}>
                  <Text fontSize="xs" color="neutral.400" mb={1}>Mínimo</Text>
                  <input type="number" placeholder="$ 0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} min={0}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </Box>
                <Text color="neutral.300" mt={4}>—</Text>
                <Box flex={1}>
                  <Text fontSize="xs" color="neutral.400" mb={1}>Máximo</Text>
                  <input type="number" placeholder="$ ∞" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} min={0}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </Box>
              </Flex>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="neutral.400" mb={2} letterSpacing="wider">ESTADO</Text>
              <Stack gap={1}>
                {CONDITIONS.map(c => (
                  <Box key={c.id} as="button" onClick={() => toggleFilter('condition', c.id)}
                    px={3} py={2} borderRadius="lg" textAlign="left" w="full" transition="all 0.15s"
                    bg={filters.condition === c.id ? 'brand.50' : 'transparent'}
                    border="1px solid" borderColor={filters.condition === c.id ? 'brand.default' : 'neutral.200'}
                  >
                    <Text fontSize="sm" color={filters.condition === c.id ? 'brand.default' : 'neutral.700'} fontWeight={filters.condition === c.id ? 'bold' : 'normal'}>
                      {c.label}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

          </Stack>
        </Box>

        <Flex gap={2} px={4} py={4} borderTop="1px solid" borderColor="neutral.100">
          <Button variant="ghost" flex={1} onClick={() => clear(onClose)}>Limpiar</Button>
          <Button flex={1} onClick={() => apply(onClose)}>Aplicar</Button>
        </Flex>
      </Box>
    </>
  )
}