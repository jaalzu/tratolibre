import { Box, Flex, Text, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'
import { CATEGORIES } from '@/lib/constants'

interface CategorySidebarProps {
  open: boolean
  onClose: () => void
}

export const CategorySidebar = ({ open, onClose }: CategorySidebarProps) => (
  <>
   <Box
  position="fixed"
  inset={0}
  bg="blackAlpha.400"
  zIndex={100}
  display={open ? 'block' : 'none'}
  onClick={onClose}
/>
    <Box
      position="fixed" top={0} left={0} h="100vh" w="260px"
      bg="white" boxShadow="xl" zIndex={101}
      transform={open ? 'translateX(0)' : 'translateX(-100%)'}
      transition="transform 0.25s ease"
      display="flex" flexDirection="column"
    >
      <Flex align="center" justify="space-between" px={5} py={3} borderBottom="1px solid" borderColor="neutral.100">
        <Text fontSize="sm" fontWeight="bold" color="neutral.600">Categorías</Text>
        <IconButton variant="ghost" size="xs" color="neutral.400" onClick={onClose} _hover={{ bg: "neutral.100", color: "neutral.700" }}>
          <i className='bx bx-x' style={{ fontSize: '18px' }}></i>
        </IconButton>
      </Flex>
      <Box overflowY="auto" flex={1} pt={2}>
      {CATEGORIES.map((cat) => (
  <NextLink key={cat.id} href={`/category/${cat.id}`} onClick={onClose}>
    <Flex px={5} py={3} borderBottom="1px solid" borderColor="neutral.50" _hover={{ bg: "neutral.50", color: "brand.default" }} align="center" justify="space-between">
      <Text fontSize="xs" fontWeight="medium" color="neutral.500">{cat.label}</Text>
      <i className='bx bx-chevron-right' style={{ opacity: 0.25, fontSize: '14px' }}></i>
    </Flex>
  </NextLink>
))}
      </Box>
    </Box>
  </>
)