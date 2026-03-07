'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'
import { CATEGORIES } from '@/lib/constants'

export const NavbarCategories = () => (
  <Box
    bg="#F8F9FA"
    overflowX="auto"

  >
    <Flex px={5} h="32px" align="center" gap={5} w="max-content" maxW="100%" mx="0">
      {CATEGORIES.map((cat) => (
        <NextLink key={cat.id} href={`/category/${cat.id}`}>
          <Text fontSize="xs" fontWeight="medium" color="black" _hover={{ color: 'brand.hover' }} whiteSpace="nowrap">
            {cat.label}
          </Text>
        </NextLink>
      ))}
    </Flex>
  </Box>
)