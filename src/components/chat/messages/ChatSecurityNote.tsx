'use client'


import { Flex, Text } from '@chakra-ui/react'

export const ChatSecurityNote = () => (
  <Flex mx="4" my="3" px="3" py="2" bg="neutral.100" borderRadius="lg" align="center" gap="2">
    <Text fontSize="xs" color="neutral.500" textAlign="center">
      🔒 Por tu seguridad, no compartas datos privados como contraseñas, datos bancarios o documentos personales.
    </Text>
  </Flex>
)