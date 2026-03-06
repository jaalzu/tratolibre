'use client'


import { Flex, Text } from '@chakra-ui/react'

export const ChatSecurityNote = () => (
  <Flex mx="5" my="1" px="2" py="2" bg="neutral.100" borderRadius="md" align="center" gap="2">
    <Text fontSize="sm" color="neutral.600" textAlign="center">
       Por tu seguridad, no compartas datos privados como contraseñas, datos bancarios o documentos personales.
    </Text>
  </Flex>
)