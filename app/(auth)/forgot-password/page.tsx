import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center">
      <Card p={5} mx={3} w="100%" maxW="440px">
        <ForgotPasswordForm />
      </Card>
    </Flex>
  );
}
