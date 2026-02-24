import { getMyConversations } from '@/features/conversations/actions'
import { createClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/messages/ChatWindow'
import NextLink from 'next/link'
import { Box, Flex, Text, Grid, Heading, Circle, Image, Stack } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string, type?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const conversations = await getMyConversations()
  const activeConversation = params.conversation
    ? conversations.find((c: any) => c.id === params.conversation)
    : conversations[0]

  return (
    <PageContainer py="8">
      <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb="8">
        Mensajes
      </Heading>

      {conversations.length === 0 ? (
        <Text color="neutral.400" fontSize="sm">
          No tenés conversaciones todavía
        </Text>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap="6" h="600px">

          {/* Lista de conversaciones */}
          <Card p="0" overflowY="auto" borderColor="neutral.100" borderRadius="lg" shadow="base">
            <Stack gap="0">
              {conversations.map((conv: any) => {
                const isBuyer = conv.buyer_id === user?.id
                const other = isBuyer ? conv.seller : conv.buyer
                const isActive = activeConversation?.id === conv.id

                return (
                  <Box
                    key={conv.id}
                    asChild
                    borderBottom="1px solid"
                    borderColor="neutral.50"
                    bg={isActive ? "neutral.50" : "transparent"}
                    _hover={{ bg: "neutral.50" }}
                    transition="background 0.2s"
                  >
                    <NextLink href={`/dashboard/messages?conversation=${conv.id}`}>
                      <Flex align="center" gap="3" p="4">
                        <Circle size="9" bg="brand.default" color="white" fontWeight="bold" fontSize="sm" flexShrink="0">
                          {other?.name?.[0]?.toUpperCase()}
                        </Circle>
                        <Box minW="0">
                          <Text fontSize="sm" fontWeight="bold" color="neutral.900" truncate>
                            {other?.name}
                          </Text>
                          <Text fontSize="xs" color="neutral.400" truncate>
                            {conv.objects?.title}
                          </Text>
                        </Box>
                      </Flex>
                    </NextLink>
                  </Box>
                )
              })}
            </Stack>
          </Card>

          {/* Chat activo */}
          <Box h="full">
            {activeConversation ? (
              <Flex direction="column" h="full">
                {/* Header del Chat */}
                <Flex align="center" gap="3" mb="4" pb="4" borderBottom="1px solid" borderColor="neutral.100">
                  {activeConversation.objects?.images?.[0] && (
                    <Image 
                      src={activeConversation.objects.images[0]} 
                      w="10" 
                      h="10" 
                      borderRadius="md" 
                      objectFit="cover" 
                      alt="Objeto"
                    />
                  )}
                  <Box>
                    <Text fontWeight="bold" color="neutral.900" fontSize="sm">
                      {activeConversation.objects?.title}
                    </Text>
                    <Text fontSize="xs" color="brand.default" fontWeight="bold">
                      ${activeConversation.objects?.sale_price?.toLocaleString('es-AR')}
                    </Text>
                  </Box>
                </Flex>

                {/* Ventana de mensajes */}
                <Box flex="1" minH="0">
                  <ChatWindow
                    conversationId={activeConversation.id}
                    userId={user?.id!}
                    type={params.type}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex h="full" align="center" justify="center" color="neutral.400" fontSize="sm" border="1px dashed" borderColor="neutral.100" borderRadius="lg">
                Seleccioná una conversación
              </Flex>
            )}
          </Box>
        </Grid>
      )}
    </PageContainer>
  )
}