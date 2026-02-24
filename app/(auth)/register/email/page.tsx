import { Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterEmailPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card px={6} py={4} w="full" maxW="400px" shadow="base" borderRadius="lg">
        <RegisterForm />
      </Card>
    </Flex>
  )
}