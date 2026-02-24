// app/login/page.tsx
import { Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card p={5} w="100%" maxW="440px">
        <LoginForm />
      </Card>
    </Flex>
  )
}