import { Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { RegisterOptions } from '@/components/auth/RegisterOptions'

export default function RegisterPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card px="8" py={3} w="full" maxW="440px" shadow="base" borderRadius="lg">
        <RegisterOptions />
      </Card>
    </Flex>
  )
}