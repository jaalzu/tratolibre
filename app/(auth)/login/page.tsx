import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" px={3}>
      <Card p={5} w="100%" maxW="480px">
        <LoginForm />
      </Card>
    </Flex>
  );
}
