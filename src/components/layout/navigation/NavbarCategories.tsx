'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'
import { CATEGORIES } from '@/lib/constants'

export const NavbarCategories = () => (
  <Box
    bg="brand.default"
    overflowX="auto"
    css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
  >
    <Flex px={6} h="32px" align="center" gap={5} w="max-content" maxW="100%" mx="0">
      {CATEGORIES.map((cat) => (
        <NextLink key={cat.id} href={`/category/${cat.id}`}>
          <Text fontSize="xs" fontWeight="medium" color="whiteAlpha.900" _hover={{ color: 'white' }} whiteSpace="nowrap">
            {cat.label}
          </Text>
        </NextLink>
      ))}
    </Flex>
  </Box>
)