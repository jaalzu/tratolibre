'use client'

import { Flex, Input, Box } from '@chakra-ui/react'
import 'boxicons/css/boxicons.min.css'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  sending: boolean
}

export const ChatInput = ({ value, onChange, onSend, sending }: ChatInputProps) => (
  <Flex p="3" gap="2" borderTop="1px solid" borderColor="neutral.100" bg="white" align="center">
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSend()}
      placeholder="   Escribí un mensaje..."
      bg="neutral.50"
      fontSize="sm"
      borderColor="neutral.200"
      borderRadius="full"
      pl="5"
      _focus={{ borderColor: 'brand.default', boxShadow: 'none' }}
    />
    <Box
      as="button"
      onClick={onSend}
      w="9" h="9" borderRadius="full"
      bg={value.trim() && !sending ? 'brand.default' : 'neutral.200'}
      display="flex" alignItems="center" justifyContent="center"
      cursor={value.trim() && !sending ? 'pointer' : 'not-allowed'}
      transition="all 0.2s"
      flexShrink={0}
    >
      <i className="bx bx-send" style={{ fontSize: '18px', color: 'white' }} />
    </Box>
  </Flex>
)