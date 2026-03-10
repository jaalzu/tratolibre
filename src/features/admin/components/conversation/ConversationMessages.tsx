import { Box, Flex, Text, Stack } from '@chakra-ui/react'

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  profiles?: { name?: string } | null
}

interface ConversationMessagesProps {
  messages: Message[]
  buyerId: string
}

export function ConversationMessages({ messages, buyerId }: ConversationMessagesProps) {
  if (messages.length === 0) {
    return (
      <Flex justify="center" py={12}>
        <Text fontSize="sm" color="fg.muted">No hay mensajes en esta conversación.</Text>
      </Flex>
    )
  }

  return (
    <Stack gap={3}>
      {messages.map((msg) => {
        const isBuyer = msg.sender_id === buyerId
        const avatarBg = isBuyer ? 'accent.default' : 'secondary.default'
const avatarColor = 'white'

        return (
          <Flex key={msg.id} gap={3} align="flex-start">
            <Box
              flexShrink={0}
              w={8} h={8}
              borderRadius="full"
              bg={avatarBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" fontWeight="bold" color={avatarColor}>
                {msg.profiles?.name?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </Box>
            <Box flex={1}>
              <Flex align="center" gap={2} mb={1}>
                <Text fontSize="sm" fontWeight="semibold" color="fg">
                  {msg.profiles?.name ?? 'Usuario desconocido'}
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {new Date(msg.created_at).toLocaleString('es-AR')}
                </Text>
              </Flex>
              <Box bg="neutral.150" borderRadius="xl" px={4} py={2}>
                <Text fontSize="sm" color="fg">{msg.content}</Text>
              </Box>
            </Box>
          </Flex>
        )
      })}
    </Stack>
  )
}