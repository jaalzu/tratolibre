import { Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card p={5} w="100%" maxW="440px">
        <ForgotPasswordForm />
      </Card>
    </Flex>
  )
}