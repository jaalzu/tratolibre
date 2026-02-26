import { Box, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'
import { CATEGORIES } from '@/lib/constants'


interface NavbarCategoriesProps {
  onOpenCats: () => void
}

export const NavbarCategories = ({ onOpenCats }: NavbarCategoriesProps) => (
  <Box bg="neutral.50" borderBottom="1px solid" borderColor="neutral.100" display={{ base: "none", md: "block" }}>
    <Flex maxW="1280px" mx="auto" px={4} h="30px" align="center">
      <Flex align="center" cursor="pointer" onClick={onOpenCats} gap={1.5} mr={6} color="neutral.500" _hover={{ color: "brand.default" }} transition="0.2s">
        <i className='bx bx-menu' style={{ fontSize: '15px' }}></i>
        <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">Todas las categorías</Text>
      </Flex>
      <Flex align="center" gap={6}>
       {CATEGORIES.slice(0, 6).map((cat) => (
  <NextLink key={cat.id} href={`/category/${cat.id}`}>
    <Text fontSize="xs" fontWeight="normal" color="neutral.400" _hover={{ color: "brand.default" }} whiteSpace="nowrap">
      {cat.label}
    </Text>
  </NextLink>
))}
      </Flex>
    </Flex>
  </Box>
)