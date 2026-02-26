'use client'

import { Flex, Input, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  sending: boolean
}

export const ChatInput = ({ value, onChange, onSend, sending }: ChatInputProps) => (
  <Flex p="3" gap="2" borderTop="1px solid" borderColor="neutral.100" bg="neutral.50">
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSend()}
      placeholder="Escribí un mensaje..."
      bg="white"
      fontSize="sm"
      borderColor="neutral.200"
      borderRadius="xl"
      _focus={{ borderColor: "brand.default", boxShadow: "none" }}
    />
    <Button onClick={onSend} disabled={sending || !value.trim()} size="md" px="6">
      {sending ? <Spinner size="xs" /> : "Enviar"}
    </Button>
  </Flex>
)