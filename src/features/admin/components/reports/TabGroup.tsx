// features/admin/components/reports/TabGroup.tsx
import { Box, Flex, Text } from '@chakra-ui/react'
import { AdminReport } from '../../types'

interface TabGroupProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  reports: AdminReport[]
  filterKey?: 'status'
}

export function TabGroup({ options, value, onChange, reports, filterKey }: TabGroupProps) {
  const activeIndex = options.findIndex(f => f.value === value)
  const pct = 100 / options.length

  return (
    <>
      {/* DESKTOP — slider */}
      <Box display={{ base: 'none', md: 'block' }} position="relative" w="full" bg="neutral.150" borderRadius="xl" p={1}>
        <Box
          position="absolute"
          top={1} left={1}
          h="calc(100% - 8px)"
          bg="neutral.50"
          borderRadius="lg"
          boxShadow="sm"
          style={{
            width: `calc(${pct}% - 8px)`,
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`,
            transition: 'transform 0.2s ease',
          }}
          zIndex={0}
        />
        <Flex position="relative" zIndex={1} w="full">
          {options.map((f) => (
            <Box
              key={f.value}
              as="button"
              flex={1} py={1.5}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              textAlign="center"
              color={value === f.value ? 'fg' : 'fg.muted'}
              onClick={() => onChange(f.value)}
              cursor="pointer"
              bg="transparent"
              transition="color 0.15s"
            >
              {f.label}
              {filterKey && f.value !== 'all' && (
                <Text as="span" ml={1} fontSize="xs" color={value === f.value ? 'brand.default' : 'fg.muted'}>
                  {reports.filter(r => r.status === f.value).length}
                </Text>
              )}
            </Box>
          ))}
        </Flex>
      </Box>

      {/* MOBILE — wrap */}
      <Flex display={{ base: 'flex', md: 'none' }} flexWrap="wrap" gap={2}>
        {options.map((f) => (
          <Box
            key={f.value}
            as="button"
            px={3} py={1.5}
            borderRadius="xl"
            fontSize="sm"
            fontWeight="medium"
            bg={value === f.value ? 'brand.default' : 'neutral.150'}
            color={value === f.value ? 'white' : 'fg.muted'}
            onClick={() => onChange(f.value)}
            cursor="pointer"
            transition="all 0.15s"
          >
            {f.label}
            {filterKey && f.value !== 'all' && (
              <Text as="span" ml={1} fontSize="xs" color={value === f.value ? 'whiteAlpha.800' : 'fg.muted'}>
                {reports.filter(r => r.status === f.value).length}
              </Text>
            )}
          </Box>
        ))}
      </Flex>
    </>
  )
}