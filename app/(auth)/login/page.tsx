// app/login/page.tsx
import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" px={3} bg="neutral.150">
      <Card p={5} w="100%" maxW="480px">
        <LoginForm />
      </Card>
    </Flex>
  );
}
