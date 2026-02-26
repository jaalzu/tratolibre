'use client'


import { Flex, Text } from '@chakra-ui/react'

interface ChatDateDividerProps {
  date: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const ChatDateDivider = ({ date }: ChatDateDividerProps) => (
  <Flex align="center" gap="3" my="4">
    <Flex flex="1" h="1px" bg="neutral.100" />
    <Text fontSize="2xs" color="neutral.400" fontWeight="medium" whiteSpace="nowrap">
      {formatDate(date)}
    </Text>
    <Flex flex="1" h="1px" bg="neutral.100" />
  </Flex>
)