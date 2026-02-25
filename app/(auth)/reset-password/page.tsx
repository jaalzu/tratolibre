import { Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="neutral.50">
      <Card p={5} w="100%" maxW="440px">
        <ResetPasswordForm />
      </Card>
    </Flex>
  )
}