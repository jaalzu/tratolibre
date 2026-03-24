import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" bg="neutral.150">
      <Card p={5} mx={3} w="100%" maxW="440px">
        <ResetPasswordForm />
      </Card>
    </Flex>
  );
}
